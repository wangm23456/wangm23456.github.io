import { useState } from 'react';

export default function WasmSimulatorEmbed() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [loadSim, setLoadSim] = useState<boolean>(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {/* Simulator Container */}
      <div
        style={{
          border: 'var(--border)',
          boxShadow: 'var(--shadow)',
          background: '#08080c',
          position: isFullscreen ? 'fixed' : 'relative',
          top: isFullscreen ? 0 : undefined,
          left: isFullscreen ? 0 : undefined,
          width: isFullscreen ? '100vw' : '100%',
          height: isFullscreen ? '100vh' : '520px',
          zIndex: isFullscreen ? 99999 : 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top Control Bar inside iframe header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--ink)',
            color: '#fff',
            padding: '0.4rem 0.8rem',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            borderBottom: '2px solid rgba(255,255,255,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ color: 'var(--yellow)', fontWeight: 800 }}>● MUJOCO WASM + ONNX 50Hz</span>
            <span style={{ opacity: 0.6 }}>|</span>
            <span style={{ fontSize: '0.68rem', color: '#4ade80' }}>纯浏览器端 0 延迟计算 · 无服务器依赖</span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setLoadSim((v) => !v)}
              style={{
                fontSize: '0.68rem',
                padding: '0.15rem 0.45rem',
                background: '#222',
                color: '#fff',
                border: '1px solid #444',
                cursor: 'pointer',
              }}
            >
              {loadSim ? '重置沙盒' : '重新加载'}
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              style={{
                fontSize: '0.68rem',
                padding: '0.15rem 0.45rem',
                background: isFullscreen ? 'var(--brand)' : 'var(--yellow)',
                color: isFullscreen ? '#fff' : 'var(--ink)',
                border: '1px solid #111',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isFullscreen ? '退出全屏 (ESC)' : '全屏体验 ↗'}
            </button>
            <a
              href="https://huggingface.co/spaces/pollen-robotics/microduck-simulator"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.68rem',
                padding: '0.15rem 0.45rem',
                background: '#2f5fe0',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: 700,
              }}
            >
              HF 原始 Space ↗
            </a>
          </div>
        </div>

        {/* Live Simulator iFrame */}
        {loadSim ? (
          <iframe
            src="https://pollen-robotics-microduck-simulator.hf.space?boot=1"
            title="Microduck Official WebAssembly Physics Sandbox"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              flex: 1,
            }}
            allow="autoplay; camera; microphone; vr"
          />
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
            }}
          >
            沙盒已暂停。点击右上角「重新加载」启动 WASM 物理引擎。
          </div>
        )}
      </div>

      {/* Control Cheatsheet Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.6rem',
          background: 'var(--card)',
          border: 'var(--border-thin)',
          padding: '0.8rem',
          fontSize: '0.74rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--brand)' }}>
            [ 基础移动与转弯 ]
          </div>
          <div><code>W / A / S / D</code> 或 <code>↑ ↓ ← →</code>：前后移动与差速转向</div>
          <div><code>Space</code>：物理世界位置重置（Reset）</div>
          <div><code>C</code>：锁定 / 解除第三人称跟随视角 (Chase Cam)</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>
            [ 模式切换与特技 ]
          </div>
          <div><code>M</code>：<b>瞬时切换 双足步行 ⇄ 四轮滑板 (Rollers)</b></div>
          <div><code>Q / E</code>：左脚 / 右脚瞬态踢球 (Ball Kick)</div>
          <div><code>R</code>：双足翻跟头 (Roll) / 轮滑极速贴地蹲滑</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#b45309' }}>
            [ 视角与拟人交互 ]
          </div>
          <div><code>鼠标左键拖拽</code>：360° 自由旋转视角 (Orbit)</div>
          <div><code>鼠标滚轮</code>：远近缩放观察关节细节</div>
          <div>点击界面底栏色块：实时给鸭子换壳换皮肤并触发 Quack 鸭叫</div>
        </div>
      </div>

      {/* Under-the-hood Tech Stack Details */}
      <div
        style={{
          background: 'var(--paper)',
          border: '1px dashed var(--ink)',
          padding: '0.7rem 0.9rem',
          fontSize: '0.73rem',
          lineHeight: '1.45',
        }}
      >
        <b style={{ color: 'var(--ink)' }}>这个 WebAssembly 沙盒底层是如何运转的？</b><br />
        这是 Hugging Face 官方开源生态中最具震撼力的技术演示之一：
        前端由 React + Vite 构建，将 DeepMind 的 <b>MuJoCo 物理求解器通过 Emscripten 编译为纯 WebAssembly 模块（@mujoco/mujoco）</b>，直接在浏览器端的主线程以 60Hz 步进高保真刚体接触力学；
        同时通过 <b>onnxruntime-web</b> 在本地以 50Hz 周期执行已训练好的 PPO 策略网络（<code>BEST_alpha_walking.onnx</code> 等），将 61D 观测张量实时解算为 14 个关节的目标位置；
        渲染层由 <b>Three.js</b> 直接读取 MuJoCo 的 <code>qpos</code> 内存数组驱动轻量化 STL 机械网格。
        此外，沙盒甚至内置了基于 <b>Trystero</b>（通过去中心化 Nostr 中继进行无服务器信令交换）的多人 P2P WebRTC 幽灵同屏系统，当多名读者同时访问时，你可以看到半透明的同行鸭子在同一个 3×3 米的虚拟竞技场内一同踢球狂奔！
      </div>
    </div>
  );
}
