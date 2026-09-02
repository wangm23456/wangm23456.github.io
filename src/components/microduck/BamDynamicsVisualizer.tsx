import { useState, useMemo } from 'react';

export default function BamDynamicsVisualizer() {
  const [voltage, setVoltage] = useState<number>(7.4); // 6.6V ~ 8.4V
  const [frictionFactor, setFrictionFactor] = useState<number>(1.0); // 0.2 ~ 2.0x
  const [backlashDeg, setBacklashDeg] = useState<number>(1.0); // 0.0 ~ 2.0 deg
  const [showIdealPd, setShowIdealPd] = useState<boolean>(true);
  const [showBam, setShowBam] = useState<boolean>(true);
  const [showRealHardware, setShowRealHardware] = useState<boolean>(true);

  // Generate 120 time-step trajectory (sine wave reference command + step change)
  const plotData = useMemo(() => {
    const steps = 100;
    const target: number[] = [];
    const idealPd: number[] = [];
    const realHw: number[] = [];
    const bam: number[] = [];

    // Voltage impact multiplier: lower voltage = less torque, more lag
    const voltageScale = Math.max(0.4, (voltage - 5.5) / 2.5); // 0.4 to 1.16

    let idealCurr = 0;
    let realCurr = 0;
    let bamCurr = 0;

    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * 4 * Math.PI;
      // Command: smooth sine wave + sharp step at t = 2pi
      let cmd = 40 * Math.sin(t);
      if (i > 50 && i < 75) {
        cmd += 25; // step perturbation
      }
      target.push(cmd);

      // 1. Ideal PD response: assuming infinite torque & linear friction
      const idealError = cmd - idealCurr;
      idealCurr += idealError * 0.28;
      idealPd.push(idealCurr);

      // 2. Real Hardware: suffers from voltage drop, stiction deadband & backlash
      const realError = cmd - realCurr;
      // Stiction threshold (deadband)
      const stiction = 4.5 * frictionFactor;
      let effectiveTorque = realError * 0.22 * voltageScale;
      if (Math.abs(realError) < stiction) {
        effectiveTorque *= 0.25; // stuck in static friction deadband
      }
      // Backlash lag: hysteresis
      const backlashLag = Math.sign(realError) * (backlashDeg * 0.8);
      realCurr += effectiveTorque - backlashLag * 0.1;
      realHw.push(realCurr);

      // 3. BAM Model: captures voltage law, back-EMF & Coulomb-Stribeck friction
      // BAM provides proactive compensation based on identified motor dynamics
      const bamError = cmd - bamCurr;
      const bamCompensation =
        bamError * 0.26 * voltageScale +
        Math.sign(bamError) * (frictionFactor * 0.8) -
        (1 - voltageScale) * 3;
      bamCurr += bamCompensation;
      bam.push(bamCurr);
    }

    return { target, idealPd, realHw, bam };
  }, [voltage, frictionFactor, backlashDeg]);

  // Compute Root Mean Square Error (RMSE) against real hardware
  const { pdRmse, bamRmse } = useMemo(() => {
    let pdErrSum = 0;
    let bamErrSum = 0;
    for (let i = 0; i < plotData.target.length; i++) {
      pdErrSum += (plotData.idealPd[i] - plotData.realHw[i]) ** 2;
      bamErrSum += (plotData.bam[i] - plotData.realHw[i]) ** 2;
    }
    return {
      pdRmse: (Math.sqrt(pdErrSum / plotData.target.length)).toFixed(2),
      bamRmse: (Math.sqrt(bamErrSum / plotData.target.length)).toFixed(2),
    };
  }, [plotData]);

  // SVG coordinate helpers
  const svgW = 600;
  const svgH = 220;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minDeg = -55;
  const maxDeg = 75;

  const getX = (idx: number) => padL + (idx / (plotData.target.length - 1)) * plotW;
  const getY = (val: number) => padT + plotH - ((val - minDeg) / (maxDeg - minDeg)) * plotH;

  const toPath = (arr: number[]) =>
    arr.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(val).toFixed(1)}`).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Interactive Controls Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.8rem',
          background: 'var(--paper-2)',
          padding: '0.8rem',
          border: 'var(--border-thin)',
        }}
      >
        {/* Voltage Sag Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>
            <span>供电母线电压 (Battery Sag):</span>
            <b style={{ color: voltage < 7.0 ? 'var(--brand)' : 'var(--ink)' }}>{voltage.toFixed(1)} V</b>
          </div>
          <input
            type="range"
            min="6.4"
            max="8.4"
            step="0.1"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--brand)', cursor: 'pointer' }}
          />
          <div style={{ fontSize: '0.65rem', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>6.4V (重载亏电)</span>
            <span>7.4V (标称)</span>
            <span>8.4V (满电)</span>
          </div>
        </div>

        {/* Friction Factor */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>
            <span>库伦/斯蒂贝克摩擦 (Friction):</span>
            <b>{frictionFactor.toFixed(1)}×</b>
          </div>
          <input
            type="range"
            min="0.3"
            max="2.2"
            step="0.1"
            value={frictionFactor}
            onChange={(e) => setFrictionFactor(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--yellow)', cursor: 'pointer' }}
          />
          <div style={{ fontSize: '0.65rem', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>0.3× (轻载顺滑)</span>
            <span>1.0× (标准)</span>
            <span>2.2× (重度咬合)</span>
          </div>
        </div>

        {/* Gear Backlash */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>
            <span>齿轮箱死区旷量 (Backlash):</span>
            <b>±{backlashDeg.toFixed(1)}°</b>
          </div>
          <input
            type="range"
            min="0.0"
            max="2.0"
            step="0.1"
            value={backlashDeg}
            onChange={(e) => setBacklashDeg(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }}
          />
          <div style={{ fontSize: '0.65rem', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>0.0° (理想无隙)</span>
            <span>1.0° (实测出厂)</span>
            <span>2.0° (磨损旷量)</span>
          </div>
        </div>
      </div>

      {/* Waveform Canvas View */}
      <div style={{ border: 'var(--border-thin)', background: 'var(--card)', padding: '0.6rem', position: 'relative' }}>
        {/* Legends & Toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontWeight: 700 }}>轨迹对比：</span>
          <span style={{ color: '#888', fontWeight: 700 }}>— 目标位姿指令 (Target)</span>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <input type="checkbox" checked={showRealHardware} onChange={(e) => setShowRealHardware(e.target.checked)} />
            <span style={{ color: 'var(--ink)', fontWeight: 800 }}>● 真实硬件响应 (Real HW)</span>
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <input type="checkbox" checked={showIdealPd} onChange={(e) => setShowIdealPd(e.target.checked)} />
            <span style={{ color: 'var(--brand)', fontWeight: 700 }}>--- 理想无损 PD (Naive Sim)</span>
          </label>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <input type="checkbox" checked={showBam} onChange={(e) => setShowBam(e.target.checked)} />
            <span style={{ color: 'var(--blue)', fontWeight: 800 }}>— BAM M6 仿真器拟合 (BAM Sim)</span>
          </label>
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: '220px', background: '#fafafa', border: '1px solid var(--ink)' }}>
          {/* Zero grid line */}
          <line x1={padL} y1={getY(0)} x2={svgW - padR} y2={getY(0)} stroke="#ddd" strokeWidth="1.5" />
          <line x1={padL} y1={getY(40)} x2={svgW - padR} y2={getY(40)} stroke="#eee" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={padL} y1={getY(-40)} x2={svgW - padR} y2={getY(-40)} stroke="#eee" strokeWidth="1" strokeDasharray="3 3" />

          {/* Target Trajectory */}
          <path d={toPath(plotData.target)} fill="none" stroke="#999" strokeWidth="1.8" strokeDasharray="4 3" />

          {/* Naive Ideal PD */}
          {showIdealPd && (
            <path d={toPath(plotData.idealPd)} fill="none" stroke="var(--brand)" strokeWidth="2" strokeDasharray="3 2" opacity={0.8} />
          )}

          {/* Real Hardware */}
          {showRealHardware && (
            <path d={toPath(plotData.realHw)} fill="none" stroke="var(--ink)" strokeWidth="2.8" />
          )}

          {/* BAM Actuator Output */}
          {showBam && (
            <path d={toPath(plotData.bam)} fill="none" stroke="var(--blue)" strokeWidth="2.2" />
          )}

          {/* Axis Labels */}
          <text x={padL - 6} y={getY(60) + 4} textAnchor="end" fontSize="9" fill="var(--muted)">+60°</text>
          <text x={padL - 6} y={getY(0) + 4} textAnchor="end" fontSize="9" fill="var(--muted)">0°</text>
          <text x={padL - 6} y={getY(-40) + 4} textAnchor="end" fontSize="9" fill="var(--muted)">-40°</text>

          {/* Time axis */}
          <text x={padL} y={svgH - 8} fontSize="9" fill="var(--muted)">0.0 s</text>
          <text x={padL + plotW * 0.5} y={svgH - 8} textAnchor="middle" fontSize="9" fill="var(--muted)">1.0 s (扰动阶跃)</text>
          <text x={svgW - padR} y={svgH - 8} textAnchor="end" fontSize="9" fill="var(--muted)">2.0 s</text>
        </svg>
      </div>

      {/* Quantitative Benchmark Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem' }}>
        <div style={{ border: 'var(--border-thin)', background: 'var(--card)', padding: '0.5rem 0.7rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 700 }}>理想 PD 相对真机误差</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--brand)' }}>
            RMSE {pdRmse}°
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>忽略电压跌落与静摩擦死区</div>
        </div>

        <div style={{ border: 'var(--border-thin)', background: 'var(--card)', padding: '0.5rem 0.7rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 700 }}>BAM 拟合真机误差</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#2a9d8f' }}>
            RMSE {bamRmse}°
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>包含反电动势与斯蒂贝克摩擦</div>
        </div>

        <div style={{ border: 'var(--border-thin)', background: 'var(--yellow)', padding: '0.5rem 0.7rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--ink)', fontWeight: 800 }}>Sim-to-Real 拟合提升</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>
            {((Number(pdRmse) - Number(bamRmse)) / (Number(pdRmse) || 1) * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--ink)' }}>零迁移失步摔倒率大幅降低</div>
        </div>
      </div>

      {/* Engineering Insight */}
      <div style={{ fontSize: '0.76rem', background: 'var(--paper)', border: '1px dashed var(--ink)', padding: '0.6rem 0.8rem', lineHeight: '1.45' }}>
        <b>为什么微型双足必须重写执行器物理？</b><br />
        800g 机器人的关节伺服（Dynamixel XL330）质量仅 18g，齿轮箱由多级微型塑料齿轮驱动。
        当电池电量从 8.4V 下跌至 6.8V 时，电机峰值输出力矩缩减达 28% 以上；如果仿真环境（如传统 MuJoCo 或 Isaac Gym 默认 PD）假设关节拥有恒定理想刚度，
        训练出的步态模型在真机上就会因为「力矩不足引发迟滞，进而引发步态发散倒地」。
        BAM 通过在 MuJoCo 动力学核心内引入真实的电机电压定律、反电动势削弱、库伦与斯蒂贝克（Stribeck）非线性摩擦，并在训练阶段对电池内阻与下垂施加域随机化（Domain Randomization），
        才让 ONNX 策略可以在真机上一次通电即平稳行走。
      </div>
    </div>
  );
}
