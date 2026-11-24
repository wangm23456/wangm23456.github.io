import { useState } from "react";
import WidgetFrame from "./WidgetFrame";

/** Widget 3：质量间隙 → 关联函数指数聚类（双对数坐标）。 */
export default function CorrelationDecay() {
  const [delta, setDelta] = useState(0.45);

  const L = 56,
    R = 600,
    T = 20,
    B = 210;
  const ymin = -13;
  const pts = (gapped: boolean) => {
    const out: [number, number][] = [];
    for (let lx = 0; lx <= 1.0001; lx += 0.02) {
      const r = 10 ** lx;
      const c = gapped ? Math.exp(-delta * r) / r : r ** -3;
      out.push([lx, Math.log10(Math.max(c, 1e-9))]);
    }
    return out
      .map(([lx, ly]) => {
        const x = L + lx * (R - L);
        // ly=0（大关联）应映射到顶部 T，ly=ymin（小关联）映射到底部 B
        const y =
          B - Math.min(Math.max((ly - ymin) / (0 - ymin), 0), 1) * (B - T);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  const zero = delta < 0.02;

  return (
    <WidgetFrame
      code="W3"
      title="关联函数的衰减率"
      caption="双对数坐标：Δ > 0 → 指数截止（理论中有粒子）；Δ = 0 → 幂律长尾（长程纠缠）。"
      note={
        zero ? (
          <>
            Δ →
            0，关联函数长尾不衰减，谱隙消失——这正是千禧年问题要求排除的情形。
          </>
        ) : (
          <>
            Δ &gt; 0 意味着
            <strong style={{ color: "var(--brand)" }}>
              物理上可分辨的粒子存在
            </strong>
            ，且理论对远距离细节「健忘」（聚类）——后者正是数学家把无穷体积极限拼起来的关键工具。Clay
            题面把它写进了存在性论证本身。
          </>
        )
      }
    >
      <svg
        viewBox="0 0 640 250"
        style={{ maxWidth: "100%" }}
        role="img"
        aria-label="关联函数衰减对比"
      >
        <line
          x1={L}
          y1={B}
          x2={R}
          y2={B}
          stroke="var(--muted)"
          strokeWidth={1.5}
        />
        <line
          x1={L}
          y1={T}
          x2={L}
          y2={B}
          stroke="var(--muted)"
          strokeWidth={1.5}
        />
        <text
          x={L - 8}
          y={T + 6}
          fontSize="12"
          fill="var(--muted)"
          textAnchor="end"
        >
          log C
        </text>
        <text
          x={R}
          y={B + 18}
          fontSize="12"
          fill="var(--muted)"
          textAnchor="end"
        >
          log r →
        </text>
        <polyline
          points={pts(false)}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        <polyline
          points={pts(true)}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={2.6}
        />
        <text x={R - 230} y={T + 16} fontSize="11.5" fill="var(--muted)">
          Δ=0：幂律（长程纠缠）
        </text>
        <text x={R - 230} y={T + 34} fontSize="11.5" fill="var(--brand)">
          Δ&gt;0：指数截止（有粒子）
        </text>
        <text
          x={L + 16}
          y={B - 30}
          fontSize="13"
          fontWeight={700}
          fill={zero ? "var(--blue)" : "var(--brand)"}
        >
          {zero
            ? "Δ → 0：无谱隙，无粒子"
            : `Δ = ${delta.toFixed(2)} → 关联长度 ξ = 1/Δ = ${(1 / delta).toFixed(1)}`}
        </text>
      </svg>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.9rem",
          marginTop: "0.8rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--muted)",
          }}
        >
          质量间隙 Δ
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(delta * 100)}
          onChange={(e) => setDelta(+e.target.value / 100)}
          style={{ flex: 1, accentColor: "var(--brand)" }}
        />
        <output
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            color: "var(--brand)",
            minWidth: "3rem",
            textAlign: "right",
          }}
        >
          {delta.toFixed(2)}
        </output>
      </label>
    </WidgetFrame>
  );
}
