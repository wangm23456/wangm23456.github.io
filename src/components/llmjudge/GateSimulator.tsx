import { useState } from "react";

/**
 * 推荐解释质量门 + 自反思修订 演示
 * 用户切换 must-have 标准、调整生成器强度、看 gate 决策与重试 K 的交互
 */

interface Criterion {
  id: string;
  label: string;
  detail: string;
  severity: "must" | "soft";
}

const CRITERIA: Criterion[] = [
  {
    id: "factual",
    label: "事实一致",
    detail: "候选剧与参考剧真有共同属性，不编造演员/导演/题材",
    severity: "must",
  },
  {
    id: "tone",
    label: "风格得体",
    detail: "语气与剧级类型匹配（惊悚不卖萌，喜剧不沉重）",
    severity: "must",
  },
  {
    id: "short",
    label: "一句话长度",
    detail: "不超过 25 字，便于移动端卡片显示",
    severity: "must",
  },
  {
    id: "no_spoiler",
    label: "不剧透",
    detail: "不揭露关键剧情或结局",
    severity: "must",
  },
  {
    id: "specific",
    label: "有锚点",
    detail: "提到具体共有元素（导演 / 题材 / 演员 / 情绪）",
    severity: "must",
  },
  {
    id: "fresh",
    label: "措辞新鲜",
    detail: "避免每次都用「相似」「也是」等模板化起手",
    severity: "soft",
  },
  {
    id: "personal",
    label: "个性化",
    detail: "与用户观看历史的关联显式可见",
    severity: "soft",
  },
];

type Strength = "weak" | "mid" | "strong";
type ModelName = "Model-A" | "Model-B" | "Model-C" | "Model-D";

interface ModelProfile {
  name: ModelName;
  basePass: Record<string, number>;
  retryGain: number;
}

const MODELS: ModelProfile[] = [
  {
    name: "Model-A",
    basePass: {
      factual: 0.92,
      tone: 0.88,
      short: 0.95,
      no_spoiler: 0.9,
      specific: 0.78,
      fresh: 0.55,
      personal: 0.5,
    },
    retryGain: 0.85,
  },
  {
    name: "Model-B",
    basePass: {
      factual: 0.88,
      tone: 0.82,
      short: 0.92,
      no_spoiler: 0.86,
      specific: 0.7,
      fresh: 0.48,
      personal: 0.45,
    },
    retryGain: 0.75,
  },
  {
    name: "Model-C",
    basePass: {
      factual: 0.83,
      tone: 0.76,
      short: 0.88,
      no_spoiler: 0.8,
      specific: 0.62,
      fresh: 0.4,
      personal: 0.4,
    },
    retryGain: 0.65,
  },
  {
    name: "Model-D",
    basePass: {
      factual: 0.6,
      tone: 0.5,
      short: 0.7,
      no_spoiler: 0.55,
      specific: 0.4,
      fresh: 0.2,
      personal: 0.25,
    },
    retryGain: 0.4,
  },
];

interface Verdict {
  pass: boolean;
  reason: string;
  iter: number;
}

function runGate(
  model: ModelProfile,
  enabledCriteria: Set<string>,
  K: number,
): { history: Verdict[]; finalPass: boolean; passAt: number | null } {
  const history: Verdict[] = [];
  let passAt: number | null = null;
  for (let i = 0; i <= K; i++) {
    // 每多一轮重试，按 retryGain 缩放通过率（按需刷新的累积改善）
    const boost = i === 0 ? 0 : (1 - Math.exp(-i * model.retryGain)) * 0.4;
    let pass = true;
    let firstFail = "";
    for (const c of CRITERIA) {
      if (!enabledCriteria.has(c.id)) continue;
      const p = Math.min(0.99, model.basePass[c.id] + boost);
      if (Math.random() > p) {
        pass = false;
        firstFail = firstFail || `${c.label} 未达`;
      }
    }
    const verdict: Verdict = {
      pass,
      reason: pass ? "全部 must-have 通过" : firstFail,
      iter: i,
    };
    history.push(verdict);
    if (pass && passAt === null) {
      passAt = i;
      break;
    }
  }
  if (passAt === null) {
    passAt = K;
  }
  return { history, finalPass: history.some((v) => v.pass), passAt };
}

export default function GateSimulator() {
  const [enabled, setEnabled] = useState<Set<string>>(
    new Set(["factual", "tone", "short", "no_spoiler", "specific"]),
  );
  const [modelId, setModelId] = useState<ModelName>("Model-A");
  const [K, setK] = useState(3);
  const [seed, setSeed] = useState(0);

  const model = MODELS.find((m) => m.name === modelId)!;
  const result = runGate(model, enabled, K);

  const toggle = (id: string) => {
    const next = new Set(enabled);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setEnabled(next);
    setSeed((s) => s + 1);
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.8rem",
          marginBottom: "0.8rem",
        }}
      >
        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
          生成器模型
          <select
            value={modelId}
            onChange={(e) => {
              setModelId(e.target.value as ModelName);
              setSeed((s) => s + 1);
            }}
            style={{
              width: "100%",
              padding: "0.3rem",
              border: "2px solid var(--ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              marginTop: "0.2rem",
              background: "var(--card)",
            }}
          >
            {MODELS.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
          重试上限 K = <strong>{K}</strong>
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={K}
            onChange={(e) => {
              setK(Number(e.target.value));
              setSeed((s) => s + 1);
            }}
            style={{
              width: "100%",
              accentColor: "var(--ink)",
              marginTop: "0.2rem",
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "0.8rem" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.74rem",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: "0.3rem",
          }}
        >
          评分细则（must-have · soft ☆）
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.35rem",
          }}
        >
          {CRITERIA.map((c) => {
            const on = enabled.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                aria-pressed={on}
                title={c.detail}
                style={{
                  padding: "0.25rem 0.55rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  background: on
                    ? c.severity === "must"
                      ? "var(--brand)"
                      : "var(--yellow)"
                    : "var(--card)",
                  color: on && c.severity === "must" ? "#fff" : "var(--ink)",
                  border: "2px solid var(--ink)",
                  cursor: "pointer",
                }}
              >
                {c.severity === "must" ? "must" : "☆"} {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          border: "var(--border-thin)",
          background: "var(--paper-2)",
          padding: "0.6rem 0.8rem",
          marginBottom: "0.7rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>
          一次解释的 K 步循环
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${K + 1}, 1fr)`,
            gap: "0.2rem",
          }}
        >
          {result.history.map((v, i) => (
            <div
              key={`${seed}-${i}`}
              style={{
                border: "2px solid var(--ink)",
                background: v.pass
                  ? "var(--yellow)"
                  : i === K
                    ? "#ef476f"
                    : "var(--card)",
                color: v.pass ? "var(--ink)" : i === K ? "#fff" : "var(--ink)",
                padding: "0.3rem 0.4rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: "0.9rem" }}>
                {v.pass ? "✓" : "✗"} k={i}
              </div>
              <div style={{ fontSize: "0.62rem", marginTop: "0.15rem" }}>
                {v.pass ? "上屏" : i === K ? "drop" : "重写"}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "0.4rem", fontSize: "0.72rem" }}>
          最终：
          {result.finalPass ? (
            <span style={{ color: "var(--brand)", fontWeight: 900 }}>
              ✓ 第 {result.passAt} 轮通过
            </span>
          ) : (
            <span
              style={{
                color: "#fff",
                background: "#ef476f",
                padding: "0.05rem 0.4rem",
                fontWeight: 900,
              }}
            >
              ✗ drop — K 次仍未通过
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          border: "var(--border)",
          background: "var(--ink)",
          color: "var(--paper)",
          padding: "0.55rem 0.8rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--yellow)" }}>Critic 在做什么？</strong>
        每轮 gate 失败时，把{" "}
        <code
          style={{
            background: "transparent",
            border: "none",
            color: "var(--paper)",
          }}
        >
          judge.reason
        </code>{" "}
        拼回 generator prompt 末尾：例如「不要剧透关键剧情 →
        重写时不引用结局」。同一个 judge 服务两个角色（gate +
        critic），理由对了，重写才不跑偏。
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.66rem",
          opacity: 0.6,
          margin: "0.5rem 0 0",
        }}
      >
        * 单次随机模拟，重新点击评分细则会刷新；真实生产里每条解释走完 K
        次、产物上屏取决于整体通过率与改写成本。
      </p>
    </div>
  );
}
