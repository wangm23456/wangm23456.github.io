import { useState } from "react";

/**
 * 四阶段生命周期导航器
 * Birth → Training (RART) → Deployment (gate + critic) → Monitoring (drift)
 * 每个阶段展示：目的、关键产出、与下一阶段的衔接
 */

interface Phase {
  id: string;
  label: string;
  code: string;
  purpose: string;
  outputs: { label: string; detail: string }[];
  handoff: string;
  keyMetric?: { name: string; value: string; note: string };
}

const PHASES: Phase[] = [
  {
    id: "birth",
    label: "I. Birth",
    code: "基准构建",
    purpose:
      "用专家对抗样本 + 人造边界 + 上线前生产采样，造一份领域基准。公域 JudgeBench/RewardBench 对推荐解释这种「项目特异、上下文敏感、文本极短」的任务覆盖不足——必须自造。",
    outputs: [
      {
        label: "专家手写对抗样本",
        detail:
          "每条带 pass/fail 标签 + 已知失败模式 + 人写的失败理由——RART 的燃料",
      },
      {
        label: "人造 + 人评边界样本",
        detail: "LLM 出、人评过；覆盖难样本",
      },
      {
        label: "上线前系统采样",
        detail: "≈900 条类平衡（54% fail），覆盖真实分布",
      },
    ],
    handoff: "→ 每条 rubric + 标签 + 理由进入 Phase II",
    keyMetric: {
      name: "上线前基准",
      value: "≈900 条",
      note: "≈54% fail，类平衡",
    },
  },
  {
    id: "training",
    label: "II. Training",
    code: "RART 反射环",
    purpose:
      "Algorithm 1 反射式调 rubric：每轮用 judge 评分，更好的就留，否则把焦点样本喂给 reflector 提案新 rubric。焦点 = 标签不一致 ∪ 同判 fail 但理由不一致。",
    outputs: [
      {
        label: "Judge = rubric 条件化分类器",
        detail: "固定 prompt 框架 + 可换 rubric 槽 + JSON {label, reason}",
      },
      {
        label: "三项对齐指标",
        detail:
          "Spec (ws=3) · Rec (wr=1) · RA_neg (wra=1)，加权分 s = 3·Spec + Rec + RA_neg",
      },
      {
        label: "Meta-judge M",
        detail:
          "只在 agreed-fail 上比对理由；ground on 人评；300 条校验到 98.6% 一致",
      },
    ],
    handoff: "→ Best-checkpoint rubric 进入 Phase III",
    keyMetric: {
      name: "校验达标",
      value: "逐项阈值",
      note: "per-criterion 早停",
    },
  },
  {
    id: "deployment",
    label: "III. Deployment",
    code: "Gate + Critic 双角色",
    purpose:
      "同一个 judge 身兼两职：质量门 + 修订评论家。每条解释按 must-have 逐一过闸，任一 fail 即入修订循环——reason 拼回生成 prompt，K=3 次兜底。",
    outputs: [
      {
        label: "Gate",
        detail: "must-have 标准逐条过滤；pass 上屏，fail 入修订",
      },
      {
        label: "Reflective critic",
        detail: "把 judge.reason 拼到 generator prompt 末尾，让同一生成器重抽",
      },
      {
        label: "K=3 重试",
        detail: "三档强模型在 k=3~4 渐近饱和；通过率 >75%",
      },
    ],
    handoff: "→ 通过的解释上屏 + 进入 Phase IV 漂移采样池",
    keyMetric: {
      name: "周推理成本",
      value: "数千美元",
      note: "剧级生成，曝光可达百万",
    },
  },
  {
    id: "monitoring",
    label: "IV. Monitoring",
    code: "漂移检测 + 闭环",
    purpose:
      "每周 ≈300 条样本分层采样 + 多人众数（≥3 人）。通过条件：M(J) ≥ mean(M(H)) − 2·sd(M(H))。跌破即触发 Phase II 在增广基准上重训——老 rubric 留作回滚。",
    outputs: [
      {
        label: "分层采样",
        detail: "首版通过 / 修订通过 / drop，再按「新剧」加权",
      },
      {
        label: "多人标注 + 众数",
        detail: "≥3 名训练有素的标注员独立评分；众数 = gold",
      },
      {
        label: "漂移阈值",
        detail: "自适应于人评分歧；不把「难测周」误判为退化",
      },
    ],
    handoff: "→ 触发重训时闭环回到 Phase II",
    keyMetric: {
      name: "回归触发",
      value: "至今未跌破",
      note: "自动化响应路径只离线验证",
    },
  },
];

export default function LifecycleNavigator() {
  const [active, setActive] = useState("birth");
  const phase = PHASES.find((p) => p.id === active)!;
  const idx = PHASES.findIndex((p) => p.id === active);

  return (
    <div>
      <div className="tabs" style={{ margin: 0 }}>
        <div className="tabs__bar" role="tablist">
          {PHASES.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              type="button"
              aria-selected={p.id === active}
              className="tabs__btn"
              onClick={() => setActive(p.id)}
            >
              <span style={{ opacity: 0.6, marginRight: "0.4rem" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {p.label.split(". ")[1]}
            </button>
          ))}
        </div>
        <div className="tabs__panel" role="tabpanel">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.6rem",
              flexWrap: "wrap",
              marginBottom: "0.6rem",
            }}
          >
            <strong style={{ fontSize: "1rem" }}>{phase.label}</strong>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                background: "var(--ink)",
                color: "var(--paper)",
                padding: "0.05rem 0.4rem",
                border: "2px solid var(--ink)",
              }}
            >
              {phase.code}
            </span>
          </div>
          <p style={{ margin: "0.4rem 0", fontSize: "0.92rem" }}>
            {phase.purpose}
          </p>

          <div
            style={{
              border: "var(--border-thin)",
              background: "var(--paper-2)",
              padding: "0.5rem 0.7rem",
              margin: "0.6rem 0",
            }}
          >
            <strong
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              关键产出
            </strong>
            <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1.2rem" }}>
              {phase.outputs.map((o) => (
                <li key={o.label} style={{ margin: "0.25rem 0" }}>
                  <strong>{o.label}</strong> —{" "}
                  <span style={{ fontSize: "0.88rem" }}>{o.detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {phase.keyMetric && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.6rem",
                padding: "0.4rem 0.7rem",
                background: "var(--yellow)",
                border: "var(--border-thin)",
                margin: "0.5rem 0",
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
              }}
            >
              <span style={{ fontWeight: 900 }}>{phase.keyMetric.name}：</span>
              <span style={{ fontWeight: 900, fontSize: "0.95rem" }}>
                {phase.keyMetric.value}
              </span>
              <span style={{ opacity: 0.75 }}>— {phase.keyMetric.note}</span>
            </div>
          )}

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.74rem",
              margin: "0.6rem 0 0",
              color: "var(--brand)",
              fontWeight: 700,
            }}
          >
            {phase.handoff}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.5rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
        }}
      >
        <button
          onClick={() => setActive(PHASES[(idx - 1 + 4) % 4].id)}
          disabled={idx === 0}
          style={{ opacity: idx === 0 ? 0.4 : 1 }}
        >
          ← 上一阶段
        </button>
        <span style={{ alignSelf: "center", opacity: 0.6 }}>{idx + 1} / 4</span>
        <button
          onClick={() => setActive(PHASES[(idx + 1) % 4].id)}
          disabled={idx === 3}
          style={{ opacity: idx === 3 ? 0.4 : 1 }}
        >
          下一阶段 →
        </button>
      </div>
    </div>
  );
}
