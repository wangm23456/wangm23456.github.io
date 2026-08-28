import { useState } from "react";

/**
 * 关键 RCT 证据卡片：点击展开结果数字与 PubMed 链接
 */

interface Study {
  id: string;
  name: string;
  tag: string;
  population: string;
  intervention: string;
  result: string;
  takeaway: string;
  refs: { label: string; url: string }[];
}

const STUDIES: Study[] = [
  {
    id: "longland",
    name: "Longland 2016",
    tag: "赤字下真增肌",
    population: "40 名年轻男性（22±1 岁，BMI ~28）",
    intervention:
      "4 周 -40% 能量赤字 + 高强度抗阻 + HIIT；高蛋白组 2.4 g/kg/d vs 常规组 1.2 g/kg/d",
    result:
      "高蛋白组：瘦体重 +1.2 ± 1.0 kg，脂肪量 -5.0 ± 0.8 kg；常规组瘦体重 +0.1 ± 1.0 kg。组间差异 P<0.05。",
    takeaway: '"赤字期增肌"的最经典人体 RCT 证据——蛋白剂量是分水岭。',
    refs: [
      {
        label: "PMID:26817506",
        url: "https://pubmed.ncbi.nlm.nih.gov/26817506/",
      },
      {
        label: "PMC4750650",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4750650/",
      },
    ],
  },
  {
    id: "garthe",
    name: "Garthe 2011 ×2",
    tag: "运动员慢速减重",
    population: "25 名精英运动员（多项目）",
    intervention: "慢速减重 0.7% 体重/周 vs 快速 1.0%/周；含 6.5 周随访",
    result:
      "两组体重降幅相近（-5.6% vs -5.5%）；慢速组瘦体重 +2.0% ± 1.3%，上肢力量优势维持至随访。",
    takeaway: "训练有素者也能在赤字下增肌——但速率要慢。",
    refs: [
      {
        label: "PMID:21558571",
        url: "https://pubmed.ncbi.nlm.nih.gov/21558571/",
      },
      {
        label: "PMID:21896944",
        url: "https://pubmed.ncbi.nlm.nih.gov/21896944/",
      },
    ],
  },
  {
    id: "ribeiro",
    name: "Ribeiro 2022",
    tag: "蛋白决定增肌与否",
    population: "老年女性（60+），24 周抗阻训练",
    intervention: "按实际蛋白摄入 tertile 分组（高/中/低）",
    result:
      "高/中蛋白组重组 z-score 显著优于低蛋白组（P<0.05）；各组脂肪量下降相近（~1.7%）。",
    takeaway: '抗阻训练背景下：蛋白剂量决定"是否真增肌"，不影响"是否减脂"。',
    refs: [
      {
        label: "PMID:35019903",
        url: "https://pubmed.ncbi.nlm.nih.gov/35019903/",
      },
    ],
  },
  {
    id: "nedeltcheva",
    name: "Nedeltcheva 2010",
    tag: "睡眠的隐藏权重",
    population: "减重门诊受试者，交叉设计",
    intervention: "5.5 h vs 8.5 h 睡眠 × 同等热量赤字",
    result: "睡眠不足组：脂肪流失减少 55%，瘦体重损失增加 60%。",
    takeaway: '同样的赤字，睡不好就从"减脂肪"变成"减肌肉"。',
    refs: [
      {
        label: "PMC2951287",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2951287/",
      },
    ],
  },
  {
    id: "morton",
    name: "Morton 2018",
    tag: "蛋白阈值 Meta",
    population: "49 项 RCT，1863 名健康成人",
    intervention: "抗阻训练 ± 蛋白补充，系统综述 + Meta 回归",
    result:
      "FFM 增量 +0.30 kg；1RM +2.49 kg；蛋白摄入 ~1.62 g/kg/d 时 FFM 增益进入平台期。",
    takeaway: '"每日 1.6 g/kg" 经验阈值的来源。',
    refs: [
      {
        label: "PMC5867436",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5867436/",
      },
    ],
  },
  {
    id: "murphy",
    name: "Murphy & Koehler 2020",
    tag: "赤字抹掉增肌不抹力量",
    population: "能量缺口 × 抗阻训练研究，Meta + Meta 回归",
    intervention: "慢性性能量缺口（约 500 kcal/d 量级）",
    result: "慢性赤字消除 RT 的瘦体重增益，但不削弱力量增益。",
    takeaway: '赤字期"保持即胜利"的定量依据；力量与肥大在赤字下解耦。',
    refs: [
      {
        label: "PMID:34623696",
        url: "https://pubmed.ncbi.nlm.nih.gov/34623696/",
      },
    ],
  },
];

export default function EvidenceCards() {
  const [open, setOpen] = useState<string | null>("longland");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      {STUDIES.map((s) => {
        const isOpen = open === s.id;
        return (
          <div
            key={s.id}
            style={{
              border: "var(--border)",
              background: "var(--card)",
              boxShadow: isOpen ? "var(--shadow)" : "var(--shadow-sm)",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : s.id)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                textAlign: "left",
                display: "flex",
                alignItems: "baseline",
                gap: "0.6rem",
                padding: "0.65rem 0.9rem",
                border: "none",
                boxShadow: "none",
                background: isOpen ? "var(--accent-yellow)" : "transparent",
                color: "var(--ink)",
                cursor: "pointer",
              }}
            >
              <strong
                style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}
              >
                {s.name}
              </strong>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  background: "var(--brand)",
                  color: "var(--card)",
                  padding: "0 0.4rem",
                  border: "2px solid var(--ink)",
                }}
              >
                {s.tag}
              </span>
              <span
                style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}
              >
                {isOpen ? "▲" : "▼"}
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: "0.6rem 0.9rem 0.8rem",
                  fontSize: "0.88rem",
                  borderTop: "var(--border-thin)",
                }}
              >
                <p style={{ margin: "0.3rem 0" }}>
                  <strong>人群：</strong>
                  {s.population}
                </p>
                <p style={{ margin: "0.3rem 0" }}>
                  <strong>干预：</strong>
                  {s.intervention}
                </p>
                <p style={{ margin: "0.3rem 0" }}>
                  <strong>结果：</strong>
                  {s.result}
                </p>
                <p style={{ margin: "0.4rem 0", fontWeight: 700 }}>
                  → {s.takeaway}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    margin: "0.4rem 0 0",
                  }}
                >
                  {s.refs.map((r) => (
                    <a
                      key={r.label}
                      href={r.url}
                      target="_blank"
                      rel="noopener"
                      style={{ marginRight: "0.7rem" }}
                    >
                      {r.label}
                    </a>
                  ))}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
