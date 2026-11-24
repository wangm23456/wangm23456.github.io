import { useState } from "react";
import WidgetFrame from "./WidgetFrame";

/** Widget 1：库仑势 vs 禁闭势——质量间隙/禁闭的最小图像。 */
export default function ConfinementPotential() {
  const [sigma, setSigma] = useState(0.6);

  const L = 52,
    R = 610,
    T = 18,
    B = 222;
  const pts = (mode: "coulomb" | "total") => {
    const out: [number, number][] = [];
    let vmax = 0;
    for (let r = 0.6; r <= 10; r += 0.1) {
      const v = mode === "coulomb" ? 1 / r : 1 / r + sigma * r;
      out.push([r, v]);
      if (r > 0.9 && v > vmax) vmax = v;
    }
    const norm = vmax || 1;
    return out
      .map(([r, v]) => {
        const x = L + (r / 10) * (R - L);
        const y = B - Math.min(v / norm, 1) * (B - T - 10);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  return (
    <WidgetFrame
      code="W1"
      title="库仑 vs 禁闭势"
      caption="纵轴：夸克对之间的势能；横轴：两者距离（格点单位）。"
      note={
        sigma > 0.02 ? (
          <>
            σ &gt; 0 时能量随距离
            <strong style={{ color: "var(--brand)" }}>线性增长</strong>
            ——拉开夸克需要无穷能量，自由夸克永远看不到。格点模拟测得 σ ≈ (440
            MeV)²。这个「线性」在数学上等价于 Wilson 圈的面积定律。
          </>
        ) : (
          <>σ = 0 是库仑势——电子绕原子核，跑得再远也拉得住。</>
        )
      }
    >
      <svg
        viewBox={`0 0 640 260`}
        style={{ maxWidth: "100%" }}
        role="img"
        aria-label="势能曲线对比图"
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
          V(r)
        </text>
        <text
          x={R}
          y={B + 18}
          fontSize="12"
          fill="var(--muted)"
          textAnchor="end"
        >
          r →
        </text>
        <polyline
          points={pts("coulomb")}
          fill="none"
          stroke="var(--blue)"
          strokeWidth={2.4}
        />
        <polyline
          points={pts("total")}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={2.6}
        />
        <line
          x1={R - 210}
          y1={T + 10}
          x2={R - 182}
          y2={T + 10}
          stroke="var(--blue)"
          strokeWidth={2.4}
        />
        <text x={R - 176} y={T + 14} fontSize="11.5" fill="var(--blue)">
          库仑 k/r
        </text>
        <line
          x1={R - 210}
          y1={T + 30}
          x2={R - 182}
          y2={T + 30}
          stroke="var(--brand)"
          strokeWidth={2.6}
        />
        <text x={R - 176} y={T + 34} fontSize="11.5" fill="var(--brand)">
          总势（含 σr）
        </text>
        <text
          x={L + 16}
          y={B - 16}
          fontSize="13"
          fontWeight={700}
          fill={sigma > 0.02 ? "var(--brand)" : "var(--muted)"}
        >
          {sigma > 0.02 ? "σr 主导 → 夸克拉不开" : "σ = 0：经典库仑势"}
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
          禁闭弦张力 σ
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(sigma * 100)}
          onChange={(e) => setSigma(+e.target.value / 100)}
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
          {sigma.toFixed(2)}
        </output>
      </label>
    </WidgetFrame>
  );
}
