import { useState } from "react";

/**
 * RART vs Vanilla 对比演示
 * 模拟 Algorithm 1 的反射环：用户拖动「rubric 改进空间」与「理由一致率」，
 * 观察两种策略在 Spec / Rec / RA_neg 三项上的演变曲线。
 *
 * 简化模型（非论文真实数据）：
 * - Vanilla: 反射环只看标签不一致，对理由无约束 → Spec 抖、RA_neg 长期贴近初始
 * - RART: 加入「同判 fail 但理由不一致」进 focus → 同时塑形标签 + 理由
 */

type Iter = number;

interface Curve {
  spec: number[];
  rec: number[];
  ra: number[];
}

// Vanilla：标签层反复修正，rubric 漂向「不犯错」，理由被空泛化
const VANILLA = (iters: number, space: number): Curve => {
  const spec: number[] = [];
  const rec: number[] = [];
  const ra: number[] = [];
  let s = 0.62,
    r = 0.85,
    a = 0.45;
  for (let i = 0; i < iters; i++) {
    if (space > 0.4) {
      // 改进空间够：Spec 抬升，Rec 略降，RA_neg 几乎不动
      s = Math.min(0.92, s + 0.06);
      r = Math.max(0.55, r - 0.04);
      a = a + (Math.random() - 0.5) * 0.05;
    } else {
      // 改进空间用尽：rubric 漂向「恰好不犯」，Spec/RA_neg 同步塌
      s = Math.max(0.5, s - 0.04);
      a = Math.max(0.3, a - 0.03);
    }
    spec.push(+s.toFixed(3));
    rec.push(+r.toFixed(3));
    ra.push(+a.toFixed(3));
  }
  return { spec, rec, ra };
};

// RART：标签 + 理由双路梯度，Spec/RA_neg 同时塑形
const RART = (iters: number, space: number, agree: number): Curve => {
  const spec: number[] = [];
  const rec: number[] = [];
  const ra: number[] = [];
  let s = 0.62,
    r = 0.85,
    a = 0.45;
  for (let i = 0; i < iters; i++) {
    // 理由一致率越高，RA_neg 抬得越快；理由对齐的反作用是 Rec 略降
    const raGain = 0.04 + agree * 0.04;
    s = Math.min(0.95, s + 0.05 + space * 0.04);
    r = Math.max(0.55, r - 0.03);
    a = Math.min(0.93, a + raGain);
    spec.push(+s.toFixed(3));
    rec.push(+r.toFixed(3));
    ra.push(+a.toFixed(3));
  }
  return { spec, rec, ra };
};

function Chart({
  data,
  label,
  color,
  max = 1.0,
}: {
  data: number[];
  label: string;
  color: string;
  max?: number;
}) {
  const W = 280;
  const H = 80;
  const stepX = W / Math.max(1, data.length - 1);
  const pts = data
    .map(
      (v, i) => `${(i * stepX).toFixed(1)},${(H - (v / max) * H).toFixed(1)}`,
    )
    .join(" ");
  const last = data[data.length - 1];
  return (
    <div style={{ margin: "0.5rem 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          marginBottom: "0.15rem",
        }}
      >
        <span style={{ color, fontWeight: 700 }}>{label}</span>
        <span style={{ opacity: 0.7 }}>末值 {last.toFixed(3)}</span>
      </div>
      <svg
        width={W}
        height={H}
        style={{ background: "var(--paper-2)", border: "2px solid var(--ink)" }}
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          points={pts}
        />
        <circle
          cx={(data.length - 1) * stepX}
          cy={H - (last / max) * H}
          r="3.5"
          fill={color}
        />
      </svg>
    </div>
  );
}

export default function RartSimulator() {
  const [itersN, setItersN] = useState(5);
  const [space, setSpace] = useState(0.7);
  const [agree, setAgree] = useState(0.6);

  const van = VANILLA(itersN, space);
  const rart = RART(itersN, space, agree);

  const vanillaFinal =
    van.spec[van.spec.length - 1] + van.ra[van.ra.length - 1];
  const rartFinal =
    rart.spec[rart.spec.length - 1] + rart.ra[rart.ra.length - 1];
  const rartWins = rartFinal > vanillaFinal + 0.05;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.8rem",
          marginBottom: "0.9rem",
        }}
      >
        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
          迭代轮数 <strong>{itersN}</strong>
          <input
            type="range"
            min={2}
            max={10}
            step={1}
            value={itersN}
            onChange={(e) => setItersN(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--ink)" }}
          />
        </label>
        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
          改进空间 <strong>{(space * 100).toFixed(0)}%</strong>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={space}
            onChange={(e) => setSpace(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--ink)" }}
          />
        </label>
        <label
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            gridColumn: "1 / -1",
          }}
        >
          初始理由一致率 <strong>{(agree * 100).toFixed(0)}%</strong>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={agree}
            onChange={(e) => setAgree(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--ink)" }}
          />
        </label>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.8rem",
        }}
      >
        <div
          style={{
            border: "var(--border-thin)",
            background: "var(--card)",
            padding: "0.5rem 0.7rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--muted)",
              marginBottom: "0.3rem",
            }}
          >
            VANILLA · 只看标签
          </div>
          <Chart data={van.spec} label="Specificity" color="#d92d20" />
          <Chart data={van.rec} label="Recall" color="#2f5fe0" />
          <Chart data={van.ra} label="RA_neg" color="#888888" />
        </div>
        <div
          style={{
            border: "var(--border-thin)",
            background: "var(--card)",
            padding: "0.5rem 0.7rem",
            boxShadow: rartWins ? "var(--shadow-sm)" : "none",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--brand)",
              marginBottom: "0.3rem",
            }}
          >
            RART · 标签 + 理由双路
          </div>
          <Chart data={rart.spec} label="Specificity" color="#d92d20" />
          <Chart data={rart.rec} label="Recall" color="#2f5fe0" />
          <Chart data={rart.ra} label="RA_neg" color="#57cc99" />
        </div>
      </div>

      <div
        style={{
          marginTop: "0.8rem",
          padding: "0.55rem 0.8rem",
          border: "var(--border-thin)",
          background: rartWins ? "var(--yellow)" : "var(--paper-2)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
        }}
      >
        {rartWins ? (
          <>
            <strong>RART 占优</strong> — 加权分 s = 3·Spec + Rec + RA_neg
            下，RART 在 Spec/RA_neg 两路同时塑形，理由一致性是分水岭。
          </>
        ) : (
          <>
            <strong>差异缩小</strong> — 改进空间接近 0% 时两路持平；RART
            不会让已饱和的 rubric 退化。
          </>
        )}
      </div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.66rem",
          opacity: 0.6,
          margin: "0.5rem 0 0",
        }}
      >
        * 示意模型，趋势与论文 Figure 2 / §5.4 一致；非真实训练数据。
      </p>
    </div>
  );
}
