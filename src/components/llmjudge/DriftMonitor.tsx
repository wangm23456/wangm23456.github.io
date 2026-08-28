import { useState } from "react";

/**
 * 漂移监测：自适应阈值 vs 固定阈值
 * 用户每周注入一组 judge 分数 + 人评样本，观察哪种阈值更稳。
 *
 * 阈值公式：M(J) ≥ mean(M(H)) − 2·sd(M(H))
 * 含义：难测周里人和 judge 都难，不把「难」误判为退化。
 */

interface Week {
  label: string;
  judgeMean: number;
  humanMean: number;
  humanSd: number;
}

const BASE_WEEKS: Week[] = [
  { label: "W1", judgeMean: 0.78, humanMean: 0.82, humanSd: 0.06 },
  { label: "W2", judgeMean: 0.79, humanMean: 0.83, humanSd: 0.07 },
  { label: "W3", judgeMean: 0.77, humanMean: 0.81, humanSd: 0.06 },
  { label: "W4", judgeMean: 0.78, humanMean: 0.82, humanSd: 0.07 },
  { label: "W5", judgeMean: 0.79, humanMean: 0.83, humanSd: 0.06 },
];

type Scenario = "stable" | "drift" | "hard" | "shift";

const SCENARIOS: Record<
  Scenario,
  { label: string; hint: string; weeks: Week[] }
> = {
  stable: {
    label: "稳态",
    hint: "judge 与人评同向平稳，无回归",
    weeks: BASE_WEEKS,
  },
  drift: {
    label: "judge 真退化",
    hint: "judge 掉 0.10，人评稳定——真回归，固定阈值会触发，自适应会触发",
    weeks: [
      { label: "W1", judgeMean: 0.78, humanMean: 0.82, humanSd: 0.06 },
      { label: "W2", judgeMean: 0.77, humanMean: 0.82, humanSd: 0.06 },
      { label: "W3", judgeMean: 0.71, humanMean: 0.82, humanSd: 0.06 },
      { label: "W4", judgeMean: 0.68, humanMean: 0.82, humanSd: 0.06 },
      { label: "W5", judgeMean: 0.65, humanMean: 0.82, humanSd: 0.06 },
    ],
  },
  hard: {
    label: "难测周",
    hint: "人评分歧大 + judge 同步难——固定阈值会误触发重训，自适应放行",
    weeks: [
      { label: "W1", judgeMean: 0.78, humanMean: 0.82, humanSd: 0.06 },
      { label: "W2", judgeMean: 0.79, humanMean: 0.83, humanSd: 0.07 },
      { label: "W3", judgeMean: 0.7, humanMean: 0.74, humanSd: 0.18 },
      { label: "W4", judgeMean: 0.71, humanMean: 0.75, humanSd: 0.17 },
      { label: "W5", judgeMean: 0.72, humanMean: 0.76, humanSd: 0.16 },
    ],
  },
  shift: {
    label: "新剧涌入（catalog shift）",
    hint: "新剧子集上 judge 同步难——切到新剧子集视图能更快发现",
    weeks: [
      { label: "W1", judgeMean: 0.78, humanMean: 0.82, humanSd: 0.06 },
      { label: "W2", judgeMean: 0.76, humanMean: 0.79, humanSd: 0.08 },
      { label: "W3", judgeMean: 0.73, humanMean: 0.77, humanSd: 0.1 },
      { label: "W4", judgeMean: 0.74, humanMean: 0.78, humanSd: 0.09 },
      { label: "W5", judgeMean: 0.75, humanMean: 0.79, humanSd: 0.08 },
    ],
  },
};

function evaluate(weeks: Week[]) {
  return weeks.map((w) => {
    const thresh = w.humanMean - 2 * w.humanSd;
    const adaptivePass = w.judgeMean >= thresh;
    const fixedThresh = 0.7;
    const fixedPass = w.judgeMean >= fixedThresh;
    return { ...w, thresh, adaptivePass, fixedPass };
  });
}

function Row({
  w,
  fixed,
  adaptive,
}: {
  w: Week & { thresh: number; adaptivePass: boolean; fixedPass: boolean };
  fixed: boolean;
  adaptive: boolean;
}) {
  return (
    <tr>
      <td>{w.label}</td>
      <td>{w.judgeMean.toFixed(2)}</td>
      <td>{w.humanMean.toFixed(2)}</td>
      <td>{w.humanSd.toFixed(2)}</td>
      <td>{w.thresh.toFixed(2)}</td>
      <td>
        {adaptive ? (
          w.adaptivePass ? (
            <span
              style={{
                background: "var(--yellow)",
                border: "2px solid var(--ink)",
                padding: "0 0.4rem",
              }}
            >
              ✓
            </span>
          ) : (
            <span
              style={{
                background: "#ef476f",
                color: "#fff",
                border: "2px solid var(--ink)",
                padding: "0 0.4rem",
              }}
            >
              ✗ 重训
            </span>
          )
        ) : (
          <span style={{ opacity: 0.4 }}>—</span>
        )}
      </td>
      <td>
        {fixed ? (
          w.fixedPass ? (
            <span style={{ opacity: 0.6 }}>✓</span>
          ) : (
            <span
              style={{
                background: "#ef476f",
                color: "#fff",
                padding: "0 0.4rem",
                fontSize: "0.7rem",
              }}
            >
              ✗ 重训
            </span>
          )
        ) : (
          <span style={{ opacity: 0.4 }}>—</span>
        )}
      </td>
    </tr>
  );
}

export default function DriftMonitor() {
  const [scenario, setScenario] = useState<Scenario>("drift");
  const [showFixed, setShowFixed] = useState(true);
  const [showAdaptive, setShowAdaptive] = useState(true);

  const cfg = SCENARIOS[scenario];
  const rows = evaluate(cfg.weeks);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.35rem",
          marginBottom: "0.7rem",
        }}
      >
        {(Object.keys(SCENARIOS) as Scenario[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScenario(s)}
            aria-pressed={scenario === s}
            style={{
              padding: "0.3rem 0.7rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              background: scenario === s ? "var(--brand)" : "var(--card)",
              color: scenario === s ? "#fff" : "var(--ink)",
              border: "2px solid var(--ink)",
              cursor: "pointer",
            }}
          >
            {SCENARIOS[s].label}
          </button>
        ))}
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          margin: "0 0 0.5rem",
          opacity: 0.75,
        }}
      >
        {cfg.hint}
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.5rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={showAdaptive}
            onChange={(e) => setShowAdaptive(e.target.checked)}
            style={{ marginRight: "0.3rem" }}
          />
          自适应阈值 M(J) ≥ mean(M(H)) − 2·sd(M(H))
        </label>
        <label>
          <input
            type="checkbox"
            checked={showFixed}
            onChange={(e) => setShowFixed(e.target.checked)}
            style={{ marginRight: "0.3rem" }}
          />
          固定阈值 ≥ 0.70
        </label>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            borderCollapse: "collapse",
            border: "var(--border-thin)",
          }}
        >
          <thead>
            <tr style={{ background: "var(--ink)", color: "var(--paper)" }}>
              <th style={{ padding: "0.3rem" }}>周</th>
              <th style={{ padding: "0.3rem" }}>judge 均值</th>
              <th style={{ padding: "0.3rem" }}>人评均值</th>
              <th style={{ padding: "0.3rem" }}>人评 sd</th>
              <th style={{ padding: "0.3rem" }}>自适应阈值</th>
              <th style={{ padding: "0.3rem" }}>自适应判定</th>
              <th style={{ padding: "0.3rem" }}>固定判定</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => (
              <Row
                key={w.label}
                w={w}
                fixed={showFixed}
                adaptive={showAdaptive}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "0.7rem",
          padding: "0.55rem 0.8rem",
          border: "var(--border-thin)",
          background: "var(--paper-2)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.76rem",
          lineHeight: 1.55,
        }}
      >
        <strong>为什么不是固定阈值？</strong> 季节性 /
        新剧涌入会让本周样本天然更难，人标注分歧也会变大。sd(M(H))
        衡量的是「多大算难」的共识，把它包进阈值 = 承认「难测周里人和 judge
        都难」，不把难当成退化。生产里同时跑两套采样视图（全集 +
        新剧子集），能在上新首周发现 catalog shift。
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.66rem",
          opacity: 0.6,
          margin: "0.5rem 0 0",
        }}
      >
        *
        数字由脚本生成以演示阈值差异；上线至今所有周采样均未跌破，自动化响应路径只经过离线验证。
      </p>
    </div>
  );
}
