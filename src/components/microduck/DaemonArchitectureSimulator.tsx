import { useState, useEffect } from 'react';

type FaultState = 'normal' | 'kill_robotd' | 'fall_detected' | 'bad_onnx_shape' | 'ota_updating';

interface DaemonSpec {
  name: string;
  role: string;
  socket: string;
  isRecoveryPath: boolean;
  isAlive: (fault: FaultState) => boolean;
  statusText: (fault: FaultState) => string;
}

const DAEMONS: DaemonSpec[] = [
  {
    name: 'robotd',
    role: '50Hz 控制循环 / 独占 Dynamixel UART 总线 / 运动学与安全层',
    socket: '/run/robotd.sock',
    isRecoveryPath: false,
    isAlive: (f) => f !== 'kill_robotd',
    statusText: (f) => {
      if (f === 'kill_robotd') return 'CRASHED (进程挂掉)';
      if (f === 'fall_detected') return 'FALLEN -> LIMP (已失软)';
      if (f === 'bad_onnx_shape') return 'REJECTED MODEL (已拒加载)';
      return '50.0 Hz ACTIVE';
    },
  },
  {
    name: 'configd',
    role: 'Wi-Fi 凭证 / 设备身份 ID / 蓝牙配对 PIN / BlueZ & NetworkManager',
    socket: '/run/configd.sock',
    isRecoveryPath: true,
    isAlive: () => true,
    statusText: () => 'ACTIVE (常驻待命)',
  },
  {
    name: 'updaterd',
    role: 'OTA 发布校验 / minisign 验签 / 原子 symlink 交换 / 健康门探活',
    socket: '/run/updaterd.sock',
    isRecoveryPath: true,
    isAlive: () => true,
    statusText: (f) => (f === 'ota_updating' ? 'VERIFYING & SWAPPING...' : 'ACTIVE (就绪)'),
  },
  {
    name: 'btd',
    role: 'BLE GATT 传输适配器 / 无网无 SSH 手机与笔记本蓝牙直连通道',
    socket: 'BLE Service',
    isRecoveryPath: true,
    isAlive: () => true,
    statusText: () => 'ADVERTISING (广播中)',
  },
  {
    name: 'padd',
    role: '游戏手柄 evdev 输入捕获 / 翻译为通用移动与头部 intent 指令',
    socket: '/run/padd/pad.sock',
    isRecoveryPath: false,
    isAlive: (f) => f !== 'kill_robotd',
    statusText: (f) => (f === 'kill_robotd' ? 'IDLE (等待 robotd)' : 'POLLING 100Hz'),
  },
  {
    name: 'mediad',
    role: '前置摄像头 VPU 硬件编码 / 局域网 WebRTC 流媒体 / :8080 交互控制台',
    socket: 'TCP :8080 / :8443',
    isRecoveryPath: false,
    isAlive: (f) => f !== 'kill_robotd',
    statusText: (f) => (f === 'kill_robotd' ? 'STANDBY' : 'WEBRTC 720p30'),
  },
  {
    name: 'tofd',
    role: '头部 8×8 ToF 深度传感器 I²C 采集 / 15Hz 广播 publish 深度点阵',
    socket: '/run/tofd/tof.sock',
    isRecoveryPath: false,
    isAlive: () => true,
    statusText: () => 'PUBLISHING 15Hz',
  },
];

function getStatusBannerBg(f: FaultState): string {
  if (f === 'kill_robotd') return '#ffebee';
  if (f === 'fall_detected') return '#fff8e1';
  if (f === 'bad_onnx_shape') return '#f3e5f5';
  if (f === 'ota_updating') return '#e8f5e9';
  return 'var(--paper-2)';
}

function getDaemonBadgeColors(alive: boolean, isRecovery: boolean): { bg: string; color: string } {
  if (!alive) return { bg: 'var(--brand)', color: '#fff' };
  if (isRecovery) return { bg: 'var(--yellow)', color: 'var(--ink)' };
  return { bg: '#2f5fe0', color: '#fff' };
}

function getOtaStepBg(done: boolean, current: boolean): string {
  if (done) return '#2f5fe0';
  if (current) return 'var(--yellow)';
  return 'var(--card)';
}

export default function DaemonArchitectureSimulator() {
  const [fault, setFault] = useState<FaultState>('normal');
  const [tick, setTick] = useState<number>(0);
  const [otaStep, setOtaStep] = useState<number>(0);

  // 50Hz simulated tick counter (every 100ms in UI for visibility)
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  // OTA animation stepper
  useEffect(() => {
    if (fault !== 'ota_updating') {
      setOtaStep(0);
      return;
    }
    const timer = setInterval(() => {
      setOtaStep((s) => {
        if (s >= 6) {
          clearInterval(timer);
          return 6;
        }
        return s + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [fault]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Fault Injection Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--muted)' }}>
          故障与场景注入控制台:
        </span>
        {[
          { key: 'normal', label: '正常 50Hz 运行 (Normal)' },
          { key: 'kill_robotd', label: '① 崩溃控制核心 (Kill robotd)' },
          { key: 'fall_detected', label: '② 触发前倾跌倒 (Trigger Fall)' },
          { key: 'bad_onnx_shape', label: '③ 注入非法模型 (Bad Shape [1,32])' },
          { key: 'ota_updating', label: '④ 执行 7 步原子 OTA 更新' },
        ].map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => setFault(btn.key as FaultState)}
            className={fault === btn.key ? 'active' : ''}
            style={{
              background: fault === btn.key ? 'var(--brand)' : 'var(--card)',
              color: fault === btn.key ? '#fff' : 'var(--ink)',
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Real-time Status Banner */}
      <div
        style={{
          border: 'var(--border-thin)',
          background: getStatusBannerBg(fault),
          padding: '0.6rem 0.8rem',
          fontSize: '0.78rem',
          lineHeight: '1.4',
        }}
      >
        {fault === 'normal' && (
          <div>
            <b style={{ color: 'var(--blue)' }}>系统平稳状态：</b>
            <code>robotd</code> 独占 <code>/dev/ttyS2</code> 串口总线，以精确 50.0 Hz 节拍轮询 15
            台伺服与双 IMU；所有外围服务通过 Unix 域套接字通信。
          </div>
        )}
        {fault === 'kill_robotd' && (
          <div>
            <b style={{ color: 'var(--brand)' }}>恢复路径（Recovery Path）保全验证：</b>
            控制循环已中断，伺服失电。<b>注意下方绿色常驻服务：</b>
            <code>configd</code>、<code>updaterd</code>、<code>btd</code> 拥有完全独立的 systemd
            单元且不依赖 <code>robotd</code>。这意味着<b>机器人绝不会变砖</b>
            ，运维人员或用户依然可以通过蓝牙直连、Wi-Fi 或 SSH 下发回滚或修复指令！
          </div>
        )}
        {fault === 'fall_detected' && (
          <div>
            <b style={{ color: '#d97706' }}>IMU 跌倒保护触发：</b>
            身体 IMU 测得投影重力向量严重偏离标准站立基准 <code>[0, 0, -1]</code>。
            安全层（Safety Layer）介入，强制触发 <code>fall -&gt; limp</code>，14
            个伺服力矩全部卸掉。防止电机堵转过热或暴力扫齿！
          </div>
        )}
        {fault === 'bad_onnx_shape' && (
          <div>
            <b style={{ color: '#7b1fa2' }}>形状门（Shape Gate）拦截非法策略：</b>
            加载的模型输入为 <code>[1, 32]</code>，未满足统一观测契约 <code>[1, 61]</code>。
            安全层在加载期直接拒绝注入，防止未对齐的异常张量破坏 14 个关节的物理限位！
          </div>
        )}
        {fault === 'ota_updating' && (
          <div>
            <b style={{ color: '#2e7d32' }}>7 步原子 OTA 升级演练中（进度 Step {otaStep}/6）：</b>
            minisign 验签 → 写入 <code>releases/0.9.2/</code> → 切换 <code>current</code> 符号链接 → 重启服务 → 探测 <code>robot.health</code> 探针！
          </div>
        )}
      </div>

      {/* 7 Daemons Architecture Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.7rem' }}>
        {DAEMONS.map((d) => {
          const alive = d.isAlive(fault);
          const isRecovery = d.isRecoveryPath;

          return (
            <div
              key={d.name}
              style={{
                border: 'var(--border-thin)',
                background: alive ? 'var(--card)' : '#fff0f0',
                padding: '0.7rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                opacity: alive ? 1 : 0.65,
                position: 'relative',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                  {d.name}.service
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.1rem 0.4rem',
                    background: getDaemonBadgeColors(alive, isRecovery).bg,
                    color: getDaemonBadgeColors(alive, isRecovery).color,
                  }}
                >
                  {d.statusText(fault)}
                </span>
              </div>

              {/* Description */}
              <div style={{ fontSize: '0.74rem', color: 'var(--ink)', lineHeight: '1.35' }}>{d.role}</div>

              {/* Metadata */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--muted)',
                  borderTop: '1px dashed var(--ink)',
                  paddingTop: '0.3rem',
                  marginTop: 'auto',
                }}
              >
                <span>接口: {d.socket}</span>
                {isRecovery && (
                  <span style={{ color: '#b45309', fontWeight: 700 }}>[RECOVERY PATH]</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* OTA Stepper Visualizer (shows if ota_updating selected) */}
      {fault === 'ota_updating' && (
        <div style={{ border: '2px solid var(--ink)', background: 'var(--paper)', padding: '0.8rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
            OTA 原子发布流水线状态 (Atomic Release Pipeline)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.3rem', textAlign: 'center', fontSize: '0.7rem' }}>
            {[
              { title: '1. Minisign 验签', desc: 'Ed25519 流式验签' },
              { title: '2. 解压归档', desc: 'zstd+tar 至 release 目录' },
              { title: '3. 原子切换', desc: 'ln -sfn 翻转 current' },
              { title: '4. 重启单元', desc: 'systemctl restart' },
              { title: '5. 健康门探活', desc: '询问 robot.health' },
              { title: '6. 固化发布', desc: '通过锁定 / 异常退回 golden' },
            ].map((st, idx) => {
              const done = otaStep >= idx + 1;
              const current = otaStep === idx;
              return (
                <div
                  key={st.title}
                  style={{
                    background: getOtaStepBg(done, current),
                    padding: '0.4rem 0.2rem',
                    fontWeight: 700,
                  }}
                >
                  <div>{st.title}</div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 500, opacity: 0.85 }}>{st.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* IPC Message Flow Terminal */}
      <div
        style={{
          border: 'var(--border-thin)',
          background: '#1a1a1a',
          color: '#e0e0e0',
          padding: '0.6rem 0.8rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          lineHeight: '1.45',
          borderRadius: '2px',
        }}
      >
        <div style={{ color: '#888', marginBottom: '0.2rem' }}>
          {/* 50Hz 实时 IPC 控制台日志 (NDJSON-RPC over Unix Domain Socket) */}
        </div>
        <div style={{ color: '#4ade80' }}>
          [TICK #{tick * 50}] robotd.sync_read: 15 servos + IMU ID 200 answered in 2.14ms.
        </div>
        {fault === 'normal' && (
          <div style={{ color: '#60a5fa' }}>
            [IPC &lt;- padd] intent: &lbrace;&quot;method&quot;:&quot;robot.move&quot;,&quot;params&quot;:[0.22, 0.0, -0.15]&rbrace; -&gt; deadman reset.
          </div>
        )}
        {fault === 'kill_robotd' && (
          <div style={{ color: '#f87171' }}>
            [ALERT] /run/robotd.sock connection refused! updaterd &amp; configd active. Ready for fallback.
          </div>
        )}
        {fault === 'fall_detected' && (
          <div style={{ color: '#facc15' }}>
            [SAFETY WARN] Projected gravity [-0.62, 0.08, -0.77] tilted &gt; 42°. Limp mode active.
          </div>
        )}
        {fault === 'bad_onnx_shape' && (
          <div style={{ color: '#c084fc' }}>
            [SHAPE_GATE] Error: Policy inputs [1, 32] != Contract [1, 61]. Model loading aborted.
          </div>
        )}
        {fault === 'ota_updating' && (
          <div style={{ color: '#34d399' }}>
            [UPDATERD] Step {otaStep}: minisign verify OK -&gt; atomic symlink swap target -&gt; probing robot.health...
          </div>
        )}
      </div>
    </div>
  );
}
