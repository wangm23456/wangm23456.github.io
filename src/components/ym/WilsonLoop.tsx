import { useState } from "react";
import WidgetFrame from "./WidgetFrame";

/** Widget 2：Wilson 圈面积定律 vs 周长定律。 */
export default function WilsonLoop() {
  const [n, setN] = useState(6);

  const cell = 30,
    ox = 40,
    oy = 30,
    cols = 13,
    rows = 7;
  const area = n * n,
    per = 4 * n;
  const sA = 0.06 * area,
    sP = 0.28 * per;
  const mx = Math.max(sA, sP, 1);
  const dominated = sA > sP;

  const lines = [];
  for (let i = 0; i <= cols; i++)
    lines.push(
      <line
        key={`v${i}`}
        x1={ox + i * cell}
        y1={oy}
        x2={ox + i * cell}
        y2={oy + rows * cell}
        stroke="var(--muted)"
        strokeWidth={0.8}
        opacity={0.5}
      />,
    );
  for (let j = 0; j <= rows; j++)
    lines.push(
      <line
        key={`h${j}`}
        x1={ox}
        y1={oy + j * cell}
        x2={ox + cols * cell}
        y2={oy + j * cell}
        stroke="var(--muted)"
        strokeWidth={0.8}
        opacity={0.5}
      />,
    );

  const bx = 480;

  return (
    <WidgetFrame
      code="W2"
      title="面积定律 vs 周长定律"
      caption="矩形 Wilson 圈 W×H：强耦合下按面积衰减（禁闭），弱耦合下按周长衰减（无禁闭）。"
      note={
        <>
          真实 QCD
          在低能端是面积定律。困难所在：物理需要我们停在两端之间的某个「不动点」上——那里恰好是现有严格数学全部失效的地方。
        </>
      }
    >
      <svg
        viewBox="0 0 640 280"
        style={{ maxWidth: "100%" }}
        role="img"
        aria-label="格点上的 Wilson 圈与衰减项对比"
      >
        {lines}
        <rect
          x={ox}
          y={oy}
          width={n * cell}
          height={n * cell}
          fill="var(--brand)"
          opacity={0.12}
        />
        <rect
          x={ox}
          y={oy}
          width={n * cell}
          height={n * cell}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={3}
        />
        <text
          x={ox}
          y={oy + rows * cell + 24}
          fontSize="12.5"
          fill="var(--ink)"
        >
          回路 {n}×{n}：面积 A={area}　周长 P={per}
        </text>
        <text
          x={ox}
          y={oy + rows * cell + 44}
          fontSize="13"
          fontWeight={700}
          fill={dominated ? "var(--brand)" : "var(--blue)"}
        >
          {dominated
            ? "面积主导 → 面积定律 → 禁闭"
            : "周长主导 → 无禁闭（弱耦合相）"}
        </text>
        {/* 衰减项条形对比 */}
        <text x={bx} y={36} fontSize="11" fill="var(--muted)">
          衰减指数
        </text>
        <rect
          x={bx}
          y={48}
          width={Math.max(2, (sA / mx) * 120)}
          height={20}
          fill="var(--brand)"
        />
        <text x={bx} y={84} fontSize="10.5" fill="var(--brand)">
          面积项 σA
        </text>
        <rect
          x={bx}
          y={118}
          width={Math.max(2, (sP / mx) * 120)}
          height={20}
          fill="var(--blue)"
        />
        <text x={bx} y={154} fontSize="10.5" fill="var(--blue)">
          周长项 λP
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
          圈尺寸 W×H
        </span>
        <input
          type="range"
          min={1}
          max={12}
          value={n}
          onChange={(e) => setN(+e.target.value)}
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
          {n}×{n}
        </output>
      </label>
    </WidgetFrame>
  );
}
