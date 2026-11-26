import { useState } from "react";
import WidgetFrame, { ChartViewport } from "./WidgetFrame";

type Road = {
  title: string;
  stages: { name: string; detail: string }[];
  reached: number;
  note: string;
};

const ROADS: Record<string, Road> = {
  rg: {
    title: "Bałaban 重整化群路线",
    reached: 2,
    stages: [
      { name: "格点定义", detail: "Wilson 1974" },
      { name: "有限体积 RG", detail: "Bałaban 1987" },
      { name: "无穷体积", detail: "未闭合" },
      { name: "4D 连续统极限", detail: "OpenAI 声称完成" },
      { name: "质量间隙", detail: "无人到达" },
    ],
    note: "Bałaban 证得紫外稳定性（1987），但连续统构造未完成。2026 年 OpenAI 声称的证明正是把这条线「走完」，声称已完成至第 4 站。第 5 站尚无人到达。",
  },
  spde: {
    title: "随机量子化路线",
    reached: 2,
    stages: [
      { name: "Parisi–Wu 框架", detail: "1981" },
      { name: "奇异 SPDE 工具", detail: "Hairer 2014" },
      { name: "3D YM–Higgs 构造", detail: "Inventiones 2024" },
      { name: "非阿贝尔 3D 全局解", detail: "开放" },
      { name: "4D 非阿贝尔", detail: "方法不适用" },
    ],
    note: "3D YM–Higgs 短时解已构造（Chandra–Chevyrev–Hairer–Shen 2024）；但整体时间解与平稳分布仍未证（3D 非阿贝尔），4D 方法目前不适用。Chatterjee 2025 年的判断：非阿贝尔 3D 全局解是下一个大目标。",
  },
  prob: {
    title: "概率论 / 格点路线",
    reached: 3,
    stages: [
      { name: "强耦合面积定律", detail: "Wilson 1974" },
      { name: "大 N 严格解", detail: "Chatterjee 2019" },
      { name: "格点质量间隙", detail: "SU/SO/U(N) 2022–25" },
      { name: "2D 全耦合控制", detail: "Piazza–Shen 2026-10" },
      { name: "4D 有限 N", detail: "未到达" },
    ],
    note: "格点层面的质量间隙定理已覆盖 SU/SO/U(N) 三族（Shen–Zhu–Zhu 2023 → Nissim 2025）；2026-10-26 Piazza–Shen 把 2D 推到全耦合。但「格点→4D 连续统、大 N→有限 N」两道坎仍开着。",
  },
};

const KEYS = ["rg", "spde", "prob"] as const;

export default function RoadmapTabs() {
  const [cur, setCur] = useState<string>("rg");
  const road = ROADS[cur];

  const gap = 520 / (road.stages.length - 1);
  const x0 = 60,
    y = 78;

  return (
    <WidgetFrame
      code="W4"
      title="三条严格路线的进展"
      caption="每条路线已到达的位置，与 4D 非阿贝尔的剩余距离。"
      note={
        <>
          <span id="road-note">{road.note}</span>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          gap: "0.6rem",
          marginBottom: "0.9rem",
          flexWrap: "wrap",
        }}
      >
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setCur(k)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              padding: "0.45rem 1.1rem",
              cursor: "pointer",
              border: "1px solid var(--color-rule)",
              borderRadius: "var(--radius-stock)",
              background: cur === k ? "var(--brand)" : "transparent",
              color: cur === k ? "var(--card)" : "var(--ink)",
              boxShadow: "none",
            }}
          >
            {ROADS[k].title}
          </button>
        ))}
      </div>
      <ChartViewport label="研究路线图表">
        <svg
          viewBox="0 0 640 190"
          role="img"
          aria-label={road.title + " 路线图"}
        >
          <text x={x0} y={26} fontSize="14" fontWeight={700} fill="var(--ink)">
            {road.title}
          </text>
          <text x={x0} y={46} fontSize="13" fill="var(--muted)">
            ● 已完成　◎ 当前前沿　○ 未到达
          </text>
          <line
            x1={x0}
            y1={y}
            x2={x0 + gap * (road.stages.length - 1)}
            y2={y}
            stroke="var(--muted)"
            strokeWidth={2}
            strokeDasharray="3 5"
          />
          {road.stages.map((s, i) => {
            const x = x0 + gap * i;
            const done = i < road.reached;
            const here = i === road.reached;
            const color = done
              ? "var(--brand)"
              : here
                ? "var(--brand)"
                : "var(--muted)";
            return (
              <g key={s.name}>
                {here && (
                  <circle
                    cx={x}
                    cy={y}
                    r={17}
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth={1}
                    strokeDasharray="2 3"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={done || here ? 11 : 8}
                  fill={done ? "var(--brand)" : "var(--card)"}
                  stroke={color}
                  strokeWidth={here ? 3 : 2}
                />
                <text
                  x={x}
                  y={y + 38}
                  fontSize="13"
                  textAnchor="middle"
                  fill={done || here ? "var(--ink)" : "var(--muted)"}
                >
                  {s.name}
                </text>
                <text
                  x={x}
                  y={y + 54}
                  fontSize="13"
                  textAnchor="middle"
                  fill="var(--muted)"
                >
                  {s.detail}
                </text>
                {i < road.stages.length - 1 && (
                  <line
                    x1={x + 16}
                    y1={y}
                    x2={x + gap - 16}
                    y2={y}
                    stroke={
                      i < road.reached - 1 ? "var(--brand)" : "var(--muted)"
                    }
                    strokeWidth={i < road.reached - 1 ? 3 : 2}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </ChartViewport>
    </WidgetFrame>
  );
}
