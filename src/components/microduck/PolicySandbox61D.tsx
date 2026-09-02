import { useState, useMemo } from 'react';

interface PolicyMeta {
  id: string;
  name: string;
  cnName: string;
  terrain: string;
  mode: 'legs' | 'rollers';
  actionFocus: string;
  onnxFile: string;
  keybind: string;
  description: string;
}

const POLICIES: PolicyMeta[] = [
  {
    id: 'velocity_walk',
    name: 'Mjlab-Velocity-Flat-MicroDuck',
    cnName: '双足全向走 (Walking Gait)',
    terrain: '平地 / 崎岖地形',
    mode: 'legs',
    actionFocus: '左/右腿 10 伺服周期摆动 + 头部自稳',
    onnxFile: 'BEST_alpha_walking.onnx',
    keybind: '左摇杆推向前后 / 右摇杆转弯',
    description: '核心主策略。根据 61D 观测中的 twist [vx, vy, yaw] 实时调整腿部相位与落足点，实现全向移动与头部凝视跟踪。',
  },
  {
    id: 'sit_stand',
    name: 'Mjlab-SitStand-Flat-MicroDuck',
    cnName: '平稳坐立 (Sit & Stand)',
    terrain: '平地',
    mode: 'legs',
    actionFocus: '膝关节深度屈曲，以底壳着地',
    onnxFile: 'BEST_alpha_sitstand.onnx',
    keybind: 'D-Pad Down 切换',
    description: '柔和坐下至下底壳，保持待机姿态并可随时一键自主站立。常用于断电前姿态收纳。',
  },
  {
    id: 'roulade',
    name: 'Mjlab-Roulade-Flat-MicroDuck',
    cnName: '向前空中翻滚 (Roulade)',
    terrain: '平地',
    mode: 'legs',
    actionFocus: '头部收缩 + 腿部爆发出力跃起前滚',
    onnxFile: 'roulade.onnx',
    keybind: 'X 键触发 (按住连翻)',
    description: '特技策略。前倾失衡后利用头部软质曲面着地，依靠惯性完成翻跟头并稳稳重新双足站立。',
  },
  {
    id: 'ground_pick',
    name: 'Mjlab-GroundPick-Flat-MicroDuck',
    cnName: '喙部俯冲拾取 (GroundPick)',
    terrain: '平地',
    mode: 'legs',
    actionFocus: '躯干前俯 75° + 喙伺服张合触地',
    onnxFile: 'ground_pick.onnx',
    keybind: 'A 键单击触发',
    description: '通过逆运动学引导嘴部接触地面特定坐标，合拢喙部叼取轻小物体后自主站立复原。',
  },
  {
    id: 'ball_kick',
    name: 'Mjlab-BallKick-Flat-MicroDuck',
    cnName: '盲踢 70mm 足球 (BallKick)',
    terrain: '平地',
    mode: 'legs',
    actionFocus: '单腿支撑 + 另一腿快速伸展冲击',
    onnxFile: 'ball_kick_left.onnx',
    keybind: 'LB / RB (左/右脚踢)',
    description: '0.5 秒开环冲击踢球策略。即使策略本身没有视觉球位置输入，也能依靠足底快速前冲将球踢出。',
  },
  {
    id: 'roller_velocity',
    name: 'Mjlab-Velocity-Flat-MicroDuck-Rollers',
    cnName: '被动滚轮滑行 (Roller Skating)',
    terrain: '平地',
    mode: 'rollers',
    actionFocus: '4 被动滚轮双腿摆弧推进',
    onnxFile: 'BEST_roller.onnx',
    keybind: '长按 D-Pad Up 3秒切滚轮',
    description: '装配轮式脚掌后的高速巡航策略。最高时速可达 0.6 m/s，相比双足步行功耗降低 40%。',
  },
  {
    id: 'roller_crouch',
    name: 'Mjlab-RollerCrouch-Flat-MicroDuck',
    cnName: '贴地蹲滑 (Roller Crouch Glide)',
    terrain: '平地',
    mode: 'rollers',
    actionFocus: '在滑行惯性中将重心下压 65%',
    onnxFile: 'BEST_roller_crouch.onnx',
    keybind: '滑行中按 A 键',
    description: '单次 3.5 秒的贴地滑行特技动作，极限压缩迎风面与通过障碍空间。',
  },
  {
    id: 'spin',
    name: 'Mjlab-Spin-Flat-MicroDuck',
    cnName: '滚轮原地旋转 (Fast Spin)',
    terrain: '平地',
    mode: 'rollers',
    actionFocus: '双腿反向剪刀差推力',
    onnxFile: 'spin.onnx',
    keybind: '右摇杆极限横向推',
    description: '在被动轮支撑下通过双腿快速内八/外八推剪差，实现极高角速度原地自转。',
  },
];

export default function PolicySandbox61D() {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('velocity_walk');
  const [speedX, setSpeedX] = useState<number>(0.35); // -0.5 to 0.8 m/s
  const [yawRate, setYawRate] = useState<number>(0.0); // -1.5 to 1.5 rad/s
  const [headTilt, setHeadTilt] = useState<number>(0.1); // -0.6 to 0.6 rad
  const [crouchHeight, setCrouchHeight] = useState<number>(0.0); // 0.0 to 0.8

  const policy = useMemo(
    () => POLICIES.find((p) => p.id === selectedPolicyId) || POLICIES[0],
    [selectedPolicyId]
  );

  // Generate the 61-D vector representation
  const observationVector = useMemo(() => {
    // 0..2: Gyro
    const gyro = [Number((yawRate * 0.4).toFixed(2)), Number((speedX * 0.2).toFixed(2)), 0.02];
    // 3..5: Projected gravity
    const gravity = [0.01, Number((-headTilt * 0.2).toFixed(2)), -0.99];
    // 6..19: Joint positions (14)
    const qpos = Array.from({ length: 14 }, (_, i) => {
      if (i === 3 || i === 12) return Number((0.65 + crouchHeight * 0.5).toFixed(2)); // knees
      if (i === 2 || i === 11) return Number((0.35 + speedX * 0.2).toFixed(2)); // hip pitch
      if (i === 6) return Number(headTilt.toFixed(2)); // head pitch
      return Number(((Math.sin(i + speedX * 5) * 0.25)).toFixed(2));
    });
    // 20..33: Joint velocities (14)
    const qvel = Array.from({ length: 14 }, (_, i) =>
      Number((Math.cos(i + speedX * 8) * (Math.abs(speedX) + 0.1) * 2.2).toFixed(2))
    );
    // 34..47: Last action (14)
    const lastAction = qpos.map((v) => Number((v * 0.9).toFixed(2)));
    // 48..50: Twist command [vx, vy, yaw_rate]
    const cmdTwist = [Number(speedX.toFixed(2)), 0.0, Number(yawRate.toFixed(2))];
    // 51..54: Head pose command
    const cmdHead = [Number(headTilt.toFixed(2)), 0.0, 0.0, 0.0];
    // 55..60: Body pose command (z, roll, pitch, ...)
    const cmdBody = [Number((-crouchHeight * 0.1).toFixed(2)), 0.0, 0.0, 0.0, 0.0, 0.0];

    return [
      ...gyro,
      ...gravity,
      ...qpos,
      ...qvel,
      ...lastAction,
      ...cmdTwist,
      ...cmdHead,
      ...cmdBody,
    ];
  }, [speedX, yawRate, headTilt, crouchHeight]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Policy Selection Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--muted)' }}>
          出厂与强化学习策略热插拔池 (点击即刻切换当前加载模型):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {POLICIES.map((p) => {
            const active = selectedPolicyId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPolicyId(p.id)}
                style={{
                  background: active ? 'var(--brand)' : 'var(--card)',
                  color: active ? '#fff' : 'var(--ink)',
                  border: 'var(--border-thin)',
                  fontSize: '0.72rem',
                  padding: '0.3rem 0.6rem',
                }}
              >
                {p.cnName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Policy Specs Banner */}
      <div
        style={{
          border: 'var(--border-thin)',
          background: 'var(--paper-2)',
          padding: '0.8rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 1.3fr) minmax(200px, 1fr)',
          gap: '0.8rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 900 }}>{policy.cnName}</span>
            <span
              style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                background: policy.mode === 'rollers' ? 'var(--yellow)' : 'var(--blue)',
                color: policy.mode === 'rollers' ? 'var(--ink)' : '#fff',
                padding: '0.1rem 0.4rem',
                fontWeight: 800,
              }}
            >
              {policy.mode === 'rollers' ? 'ROLLER VARIANT' : 'BIPED LEG'}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', lineHeight: '1.4', marginBottom: '0.4rem' }}>{policy.description}</div>
          <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
            <b>ONNX 固件文件：</b><code>/opt/robot/daemon/current/policies/{policy.onnxFile}</code>
          </div>
        </div>

        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '0.3rem', borderLeft: '1px dashed var(--ink)', paddingLeft: '0.8rem' }}>
          <div><span style={{ color: 'var(--muted)' }}>任务注册 ID:</span> <b>{policy.name}</b></div>
          <div><span style={{ color: 'var(--muted)' }}>手柄映射指令:</span> <b style={{ color: 'var(--brand)' }}>{policy.keybind}</b></div>
          <div><span style={{ color: 'var(--muted)' }}>主要驱动关节:</span> <b>{policy.actionFocus}</b></div>
          <div><span style={{ color: 'var(--muted)' }}>输入/输出契约:</span> <b>obs [1, 61] -&gt; action [1, 14]</b></div>
        </div>
      </div>

      {/* Interactive Command Cockpit (Virtual Gamepad Input) */}
      <div style={{ border: 'var(--border-thin)', background: 'var(--card)', padding: '0.8rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '0.6rem' }}>
          虚拟遥控摇杆 (修改 13 维指令插槽，观察 61 维观测向量的实时波动)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
              <span>前进/后退速度 twist.vx:</span>
              <b>{speedX.toFixed(2)} m/s</b>
            </div>
            <input
              type="range"
              min="-0.3"
              max="0.8"
              step="0.05"
              value={speedX}
              onChange={(e) => setSpeedX(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--brand)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
              <span>转向航向角速度 twist.yaw:</span>
              <b>{yawRate.toFixed(2)} rad/s</b>
            </div>
            <input
              type="range"
              min="-1.5"
              max="1.5"
              step="0.1"
              value={yawRate}
              onChange={(e) => setYawRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--yellow)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
              <span>头部俯仰凝视 head.pitch:</span>
              <b>{headTilt.toFixed(2)} rad</b>
            </div>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.05"
              value={headTilt}
              onChange={(e) => setHeadTilt(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--blue)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
              <span>姿态蹲伏比例 body.crouch:</span>
              <b>{crouchHeight.toFixed(2)}</b>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.9"
              step="0.05"
              value={crouchHeight}
              onChange={(e) => setCrouchHeight(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--ink)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* 61D Vector Visual Heatmap Grid */}
      <div style={{ border: 'var(--border-thin)', background: '#141414', color: '#eee', padding: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#4ade80' }}>
            // 实时 61 维策略观测张量 (Observation Tensor [1, 61])
          </span>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#888' }}>
            50 Hz 周期更新 · 跨所有策略 100% 格式冻结
          </span>
        </div>

        {/* Categories breakdown */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', marginBottom: '0.6rem' }}>
          <span style={{ background: '#1e3a8a', padding: '0.1rem 0.3rem' }}>0..2 角速度陀螺 (3)</span>
          <span style={{ background: '#1e40af', padding: '0.1rem 0.3rem' }}>3..5 投影重力 (3)</span>
          <span style={{ background: '#065f46', padding: '0.1rem 0.3rem' }}>6..19 关节位置 qpos (14)</span>
          <span style={{ background: '#047857', padding: '0.1rem 0.3rem' }}>20..33 关节角速度 qvel (14)</span>
          <span style={{ background: '#854d0e', padding: '0.1rem 0.3rem' }}>34..47 上周期动作 (14)</span>
          <span style={{ background: '#991b1b', padding: '0.1rem 0.3rem' }}>48..50 移动指令 (3)</span>
          <span style={{ background: '#701a75', padding: '0.1rem 0.3rem' }}>51..60 姿态指令 (10)</span>
        </div>

        {/* Tensor Cells Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(38px, 1fr))',
            gap: '3px',
            background: '#222',
            padding: '4px',
          }}
        >
          {observationVector.map((val, idx) => {
            // Group coloring
            let cellBg = '#27272a';
            if (idx <= 2) cellBg = '#1e3a8a';
            else if (idx <= 5) cellBg = '#1e40af';
            else if (idx <= 19) cellBg = '#065f46';
            else if (idx <= 33) cellBg = '#047857';
            else if (idx <= 47) cellBg = '#854d0e';
            else if (idx <= 50) cellBg = '#991b1b';
            else cellBg = '#701a75';

            return (
              <div
                key={idx}
                style={{
                  background: cellBg,
                  padding: '2px 3px',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center',
                  borderRadius: '1px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                title={`obs[${idx}]: ${val}`}
              >
                <div style={{ color: '#aaa', fontSize: '0.52rem' }}>#{idx}</div>
                <div style={{ fontWeight: 700, color: '#fff' }}>{val}</div>
              </div>
            );
          })}
        </div>

        {/* Hot Swap Technical Explanation */}
        <div style={{ marginTop: '0.8rem', fontSize: '0.72rem', color: '#bbb', lineHeight: '1.45', borderTop: '1px solid #333', paddingTop: '0.6rem' }}>
          <b style={{ color: '#60a5fa' }}>为什么能够实现零重启热插拔（Zero-Restart Policy Hot-Swapping）？</b><br />
          在传统机器人架构中，每个技能往往定义不同的观测状态空间（例如走的时候需要速度，抓的时候需要手部坐标，翻滚的时候需要俯仰角），导致技能切换必须重启环境或重新分配张量内存。
          Microduck 的工程团队通过在 <code>microduck_rl</code> 中建立严格的 <b>61 维统一观测契约</b>：
          即便特定策略不需要某个插槽（例如踢球策略不需要头姿态指令），也强制进行零填充（Zero-pad）。
          在 C/Rust 运行时中，<code>robotd</code> 只需在 50Hz 控制循环的 tick 切换瞬间，将 <code>ort::Session</code> 的模型指针从 <code>walk.onnx</code> 切换为 <code>sitstand.onnx</code>，即可在 20ms 内完成技能瞬时交接！
        </div>
      </div>
    </div>
  );
}
