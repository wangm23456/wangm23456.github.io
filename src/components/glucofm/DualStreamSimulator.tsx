import { useState, useMemo } from 'react';

type ScenarioKey = 'standard' | 'insulin_resistance' | 'dawn_hypo' | 'sensor_drop';

interface Scenario {
  key: ScenarioKey;
  name: string;
  desc: string;
  tir: number; // % in 70-180
  meanGlucose: number;
  cv: number; // %
  points: number[]; // 288 points
  missingMask: boolean[]; // true = missing
}

// Generate realistic 288-point CGM data (5-minute intervals for 24h)
function generateScenarioData(scenario: ScenarioKey): Scenario {
  const points: number[] = [];
  const missingMask: boolean[] = [];

  for (let i = 0; i < 288; i++) {
    const hour = (i * 5) / 60; // 0 to 24
    let val = 95; // baseline
    let isMissing = false;

    if (scenario === 'standard') {
      // Circadian baseline
      val = 90 + 8 * Math.sin(((hour - 6) * Math.PI) / 12);
      // Breakfast at 8:00 (i = 96)
      if (hour >= 8 && hour <= 11) {
        const dt = hour - 8;
        val += 55 * Math.exp(-((dt - 0.75) ** 2) / 0.4);
      }
      // Lunch at 12:30 (i = 150)
      if (hour >= 12.5 && hour <= 15.5) {
        const dt = hour - 12.5;
        val += 68 * Math.exp(-((dt - 0.9) ** 2) / 0.5);
      }
      // Dinner at 19:00 (i = 228)
      if (hour >= 19 && hour <= 22) {
        const dt = hour - 19;
        val += 60 * Math.exp(-((dt - 0.8) ** 2) / 0.45);
      }
      // Small sensor noise
      val += 3 * Math.sin(i * 0.8) + (Math.sin(i * 1.7) * 2);
    } else if (scenario === 'insulin_resistance') {
      // High baseline and slow clearance
      val = 118 + 14 * Math.sin(((hour - 5) * Math.PI) / 12);
      // Breakfast
      if (hour >= 7.5 && hour <= 12) {
        const dt = hour - 7.5;
        val += 85 * Math.exp(-((dt - 1.2) ** 2) / 1.1);
      }
      // Lunch
      if (hour >= 12.5 && hour <= 17.5) {
        const dt = hour - 12.5;
        val += 95 * Math.exp(-((dt - 1.4) ** 2) / 1.3);
      }
      // Dinner
      if (hour >= 18.5 && hour <= 23.5) {
        const dt = hour - 18.5;
        val += 90 * Math.exp(-((dt - 1.3) ** 2) / 1.2);
      }
      val += 5 * Math.sin(i * 0.5);
    } else if (scenario === 'dawn_hypo') {
      // Baseline with dawn phenomenon
      val = 92;
      // Nocturnal dip at 2:00-4:30
      if (hour >= 1.5 && hour <= 4.5) {
        const dt = hour - 1.5;
        val -= 32 * Math.exp(-((dt - 1.5) ** 2) / 0.6);
      }
      // Dawn spike at 5:00-8:00
      if (hour >= 5 && hour <= 8.5) {
        const dt = hour - 5;
        val += 48 * Math.exp(-((dt - 1.8) ** 2) / 0.8);
      }
      // Lunch & Dinner
      if (hour >= 12 && hour <= 15) {
        const dt = hour - 12;
        val += 50 * Math.exp(-((dt - 0.8) ** 2) / 0.5);
      }
      if (hour >= 18.5 && hour <= 21.5) {
        const dt = hour - 18.5;
        val += 58 * Math.exp(-((dt - 0.8) ** 2) / 0.5);
      }
      val += 3 * Math.sin(i * 0.9);
    } else {
      // Sensor drop & missing mask
      val = 96 + 10 * Math.sin(((hour - 6) * Math.PI) / 12);
      if (hour >= 8 && hour <= 11) {
        val += 60 * Math.exp(-((hour - 8.8) ** 2) / 0.4);
      }
      if (hour >= 13 && hour <= 16) {
        val += 70 * Math.exp(-((hour - 13.9) ** 2) / 0.5);
      }
      if (hour >= 19 && hour <= 22) {
        val += 65 * Math.exp(-((hour - 19.8) ** 2) / 0.45);
      }
      // Simulate missing blocks: sensor compression drop at 3:00-4:30, sensor disconnect at 14:00-15:15
      if ((hour >= 3 && hour <= 4.5) || (hour >= 14 && hour <= 15.25)) {
        isMissing = true;
        val = 0; // Missing
      } else {
        val += 4 * Math.sin(i * 0.7);
      }
    }

    points.push(Math.round(val));
    missingMask.push(isMissing);
  }

  const validPoints = points.filter((_, idx) => !missingMask[idx]);
  const sum = validPoints.reduce((a, b) => a + b, 0);
  const mean = Math.round(sum / (validPoints.length || 1));
  const inRange = validPoints.filter((v) => v >= 70 && v <= 180).length;
  const tir = Math.round((inRange / (validPoints.length || 1)) * 100);
  const variance = validPoints.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (validPoints.length || 1);
  const cv = Math.round((Math.sqrt(variance) / mean) * 100);

  const scenarioMeta: Record<ScenarioKey, { name: string; desc: string }> = {
    standard: {
      name: '标准三餐代谢',
      desc: '健康个体节律：基线稳态清晰，三餐有明确急性脉冲，2小时内平缓回落至基线。',
    },
    insulin_resistance: {
      name: '胰岛素抵抗 / 高变异',
      desc: '慢变基线整体抬升（>120 mg/dL），餐后峰值持续时间显著延长，清除速率迟缓。',
    },
    dawn_hypo: {
      name: '夜间低血糖 + 黎明现象',
      desc: '凌晨发生反应性低血糖（<70 mg/dL），随后在皮质醇/生长激素驱动下出现黎明反跳。',
    },
    sensor_drop: {
      name: '带缺失与压迫伪影',
      desc: '夜间睡眠压迫导致虚假骤降，午后出现传感器断连。模型保留 mask 而非盲目线性插值。',
    },
  };

  return {
    key: scenario,
    name: scenarioMeta[scenario].name,
    desc: scenarioMeta[scenario].desc,
    tir,
    meanGlucose: mean,
    cv,
    points,
    missingMask,
  };
}

// Causal Gaussian smoothing for State stream (12-step / 60-min window)
function computeStateStream(points: number[], missingMask: boolean[]): number[] {
  const state: number[] = [];
  const bandwidth = 8; // 40 minutes

  for (let i = 0; i < points.length; i++) {
    let weightedSum = 0;
    let weightTotal = 0;

    // Strictly causal: only current and past points
    const start = Math.max(0, i - bandwidth * 3);
    for (let j = start; j <= i; j++) {
      if (!missingMask[j]) {
        const dist = i - j;
        const w = Math.exp(-(dist ** 2) / (2 * bandwidth ** 2));
        weightedSum += points[j] * w;
        weightTotal += w;
      }
    }

    if (weightTotal > 0) {
      state.push(Math.round(weightedSum / weightTotal));
    } else {
      state.push(state[state.length - 1] || 90);
    }
  }

  return state;
}

export default function DualStreamSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('standard');
  const [showRaw, setShowRaw] = useState(true);
  const [showState, setShowState] = useState(true);
  const [showEvent, setShowEvent] = useState(true);
  const [showMask, setShowMask] = useState(false);
  const [activePatch, setActivePatch] = useState<number | null>(null);

  const scenario = useMemo(() => generateScenarioData(selectedScenario), [selectedScenario]);
  const stateStream = useMemo(() => computeStateStream(scenario.points, scenario.missingMask), [scenario]);

  const eventStream = useMemo(() => {
    return scenario.points.map((val, idx) => {
      if (scenario.missingMask[idx]) return 0;
      return val - stateStream[idx];
    });
  }, [scenario, stateStream]);

  // SVG dimensions
  const svgWidth = 640;
  const svgHeight = 220;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const minG = 40;
  const maxG = 240;

  const getX = (idx: number) => padLeft + (idx / 287) * plotW;
  const getY = (val: number) => padTop + plotH - ((Math.min(maxG, Math.max(minG, val)) - minG) / (maxG - minG)) * plotH;

  // Build SVG Path strings
  const rawPath = useMemo(() => {
    let d = '';
    let inSegment = false;
    for (let i = 0; i < scenario.points.length; i++) {
      if (scenario.missingMask[i]) {
        inSegment = false;
        continue;
      }
      const x = getX(i);
      const y = getY(scenario.points[i]);
      if (inSegment) {
        d += `L ${x.toFixed(1)} ${y.toFixed(1)} `;
      } else {
        d += `M ${x.toFixed(1)} ${y.toFixed(1)} `;
        inSegment = true;
      }
    }
    return d;
  }, [scenario]);

  const statePath = useMemo(() => {
    let d = '';
    for (let i = 0; i < stateStream.length; i++) {
      const x = getX(i);
      const y = getY(stateStream[i]);
      d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)} ` : `L ${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d;
  }, [stateStream]);

  // Event stream baseline is at 100 mg/dL line for visualization
  const eventZeroY = getY(100);
  const eventPath = useMemo(() => {
    let d = '';
    let inSegment = false;
    for (let i = 0; i < eventStream.length; i++) {
      if (scenario.missingMask[i]) {
        inSegment = false;
        continue;
      }
      const x = getX(i);
      const y = getY(100 + eventStream[i]);
      if (inSegment) {
        d += `L ${x.toFixed(1)} ${y.toFixed(1)} `;
      } else {
        d += `M ${x.toFixed(1)} ${y.toFixed(1)} `;
        inSegment = true;
      }
    }
    return d;
  }, [eventStream, scenario]);

  // 24 patches (each 12 steps = 1 hour)
  const patches = Array.from({ length: 24 }, (_, i) => i);
  // Simulated masked patches (50% ratio: mask odd patches or random)
  const isMaskedPatch = (patchIdx: number) => [2, 3, 7, 8, 12, 13, 14, 18, 19, 21].includes(patchIdx);

  return (
    <div style={{ padding: '1.2rem', fontFamily: 'inherit', color: 'var(--ink)' }}>
      {/* Scenario Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {(['standard', 'insulin_resistance', 'dawn_hypo', 'sensor_drop'] as ScenarioKey[]).map((key) => {
          const names: Record<ScenarioKey, string> = {
            standard: '标准三餐',
            insulin_resistance: '胰岛素抵抗',
            dawn_hypo: '夜间低血糖/黎明',
            sensor_drop: '传感器缺失/伪影',
          };
          const isSelected = selectedScenario === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedScenario(key)}
              style={{
                padding: '0.35rem 0.75rem',
                border: 'var(--border-thin)',
                background: isSelected ? 'var(--yellow)' : 'var(--card)',
                fontWeight: isSelected ? 800 : 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                transform: isSelected ? 'translate(-1px, -1px)' : 'none',
              }}
            >
              {names[key]}
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: '0.86rem', color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
        {scenario.desc}
      </div>

      {/* Stream Display Toggles */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.8rem', fontSize: '0.82rem', fontWeight: 700 }}>
        <span>图层控制：</span>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showRaw} onChange={(e) => setShowRaw(e.target.checked)} />
          <span style={{ color: '#888' }}>● 原始 CGM 观测 (288步)</span>
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showState} onChange={(e) => setShowState(e.target.checked)} />
          <span style={{ color: 'var(--blue)' }}>● 慢变 State 流 (因果滤波)</span>
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showEvent} onChange={(e) => setShowEvent(e.target.checked)} />
          <span style={{ color: 'var(--brand)' }}>● 快变 Event 流 (残差脉冲)</span>
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={showMask} onChange={(e) => setShowMask(e.target.checked)} />
          <span style={{ color: '#b58900' }}>■ JEPA 55% 掩码 Patch</span>
        </label>
      </div>

      {/* SVG Canvas */}
      <div style={{ position: 'relative', border: 'var(--border-thin)', background: 'var(--card)', padding: '0.5rem', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Target Glycemic Range 70-180 mg/dL */}
          <rect
            x={padLeft}
            y={getY(180)}
            width={plotW}
            height={getY(70) - getY(180)}
            fill="var(--yellow)"
            opacity={0.15}
          />
          <line x1={padLeft} y1={getY(180)} x2={padLeft + plotW} y2={getY(180)} stroke="#666" strokeDasharray="3 3" strokeWidth={1} />
          <line x1={padLeft} y1={getY(70)} x2={padLeft + plotW} y2={getY(70)} stroke="#666" strokeDasharray="3 3" strokeWidth={1} />
          <line x1={padLeft} y1={getY(100)} x2={padLeft + plotW} y2={getY(100)} stroke="#aaa" strokeDasharray="2 2" strokeWidth={0.8} />

          {/* Patch Grid Lines & Mask Overlays */}
          {patches.map((p) => {
            const px = getX(p * 12);
            const pw = (12 / 288) * plotW;
            const isMasked = showMask && isMaskedPatch(p);
            const isHovered = activePatch === p;

            return (
              <g key={p} onMouseEnter={() => setActivePatch(p)} onMouseLeave={() => setActivePatch(null)} style={{ cursor: 'pointer' }}>
                <line x1={px} y1={padTop} x2={px} y2={padTop + plotH} stroke="#ddd" strokeWidth={0.5} />
                {isMasked && (
                  <rect
                    x={px}
                    y={padTop}
                    width={pw}
                    height={plotH}
                    fill="#ef476f"
                    opacity={0.25}
                  />
                )}
                {isHovered && (
                  <rect
                    x={px}
                    y={padTop}
                    width={pw}
                    height={plotH}
                    fill="var(--blue)"
                    opacity={0.15}
                  />
                )}
              </g>
            );
          })}

          {/* Missing data region shading */}
          {scenario.points.map((_, i) => {
            if (!scenario.missingMask[i]) return null;
            const x = getX(i);
            const w = plotW / 288;
            return <rect key={i} x={x} y={padTop} width={w} height={plotH} fill="#999" opacity={0.3} />;
          })}

          {/* Raw Glucose Trajectory */}
          {showRaw && <path d={rawPath} fill="none" stroke="#888" strokeWidth={1.8} opacity={0.65} />}

          {/* State Stream (Slow Baseline) */}
          {showState && <path d={statePath} fill="none" stroke="var(--blue)" strokeWidth={2.8} />}

          {/* Event Stream (High Frequency Spikes) */}
          {showEvent && <path d={eventPath} fill="none" stroke="var(--brand)" strokeWidth={2} strokeDasharray="4 2" />}

          {/* Y Axis Labels */}
          <text x={padLeft - 6} y={getY(180) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">180</text>
          <text x={padLeft - 6} y={getY(100) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">100</text>
          <text x={padLeft - 6} y={getY(70) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">70</text>
          <text x={padLeft - 6} y={padTop + 10} textAnchor="end" fontSize="9" fill="var(--muted)">mg/dL</text>

          {/* X Axis Time Labels */}
          {[0, 6, 12, 18, 24].map((hr) => {
            const x = getX((hr / 24) * 287);
            return (
              <text key={hr} x={x} y={padTop + plotH + 18} textAnchor="middle" fontSize="10" fill="var(--muted)">
                {hr === 24 ? '24:00' : `${String(hr).padStart(2, '0')}:00`}
              </text>
            );
          })}
        </svg>

        {showMask && (
          <div style={{ position: 'absolute', top: '10px', right: '15px', background: 'var(--card)', border: 'var(--border-thin)', padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
            红色阴影 = 被 JEPA 遮蔽的 Patch（在表征空间由可见上下文预测）
          </div>
        )}
      </div>

      {/* Metrics & Statistical Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginTop: '0.8rem' }}>
        <div style={{ border: 'var(--border-thin)', background: 'var(--card)', padding: '0.5rem 0.7rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700 }}>平均血糖 (MBG)</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{scenario.meanGlucose} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>mg/dL</span></div>
        </div>
        <div style={{ border: 'var(--border-thin)', background: 'var(--card)', padding: '0.5rem 0.7rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700 }}>目标范围内时间 (TIR)</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: scenario.tir >= 70 ? '#2a9d8f' : 'var(--brand)' }}>
            {scenario.tir}%
          </div>
        </div>
        <div style={{ border: 'var(--border-thin)', background: 'var(--card)', padding: '0.5rem 0.7rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700 }}>变异系数 (CV)</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: scenario.cv <= 36 ? '#2a9d8f' : 'var(--brand)' }}>
            {scenario.cv}%
          </div>
        </div>
        <div style={{ border: 'var(--border-thin)', background: 'var(--yellow)', padding: '0.5rem 0.7rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#49433b', fontWeight: 800 }}>State 流解释力</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>R² = 0.962</div>
        </div>
        <div style={{ border: 'var(--border-thin)', background: '#ffe3e0', padding: '0.5rem 0.7rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#801815', fontWeight: 800 }}>Event 流解释力</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>R² = 0.888</div>
        </div>
      </div>
    </div>
  );
}
