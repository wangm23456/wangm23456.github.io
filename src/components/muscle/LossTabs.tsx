import { useState } from "react";

/**
 * 肌肉流失四状态对比：赤字 / 废用 / 肌少症 / 恶病质
 */

interface State_ {
  id: string;
  label: string;
  trigger: string;
  pathway: string;
  features: string;
  reversible: string;
  refs: { label: string; url: string }[];
}

const STATES: State_[] = [
  {
    id: "deficit",
    label: "能量赤字 / 节食",
    trigger:
      "胰岛素/IGF-1↓ → mTORC1↓ + FoxO 脱抑制；瘦素下降加剧；大赤字时皮质醇经 GR→REDD1/KLF15 加入。",
    pathway:
      "合成抑制为主、分解升高为辅——短期赤字 MPB 变化不显著，流失主要来自 MPS 下降。",
    features:
      "无防护减重时瘦体重损失占减重 15–35%；>40% 赤字触发 mTOR refractory。",
    reversible:
      "高度可控：高蛋白（1.6–2.4 g/kg/d）+ 抗阻训练可保留 ~45–95% 瘦体重；CR+RT 几乎完全预防。",
    refs: [
      {
        label: "PMID:28899879",
        url: "https://pubmed.ncbi.nlm.nih.gov/28899879/",
      },
      {
        label: "PMC5946208",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5946208/",
      },
    ],
  },
  {
    id: "disuse",
    label: "废用 / 卸载",
    trigger: "力学卸载 → Akt↓ → FoxO↑，atrogene 在 48–72 h 达峰。",
    pathway:
      "FoxO→UPS+自噬同时启动；但短期（≤4 天）人体研究显示流失几乎全部来自 MPS 下降。",
    features: "卧床、制动、失重；局部性强，与全身炎症无关。",
    reversible:
      '较易逆转——恢复负荷后 MPS 快速回升；抗阻训练可急性"重启"mTORC1 敏感性。',
    refs: [
      {
        label: "PMC9397550",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9397550/",
      },
    ],
  },
  {
    id: "sarcopenia",
    label: "肌少症（衰老）",
    trigger:
      "多因素：神经肌肉接头退变 + 慢性低度炎症 + 线粒体功能障碍 + 激素变化 + 合成代谢抵抗。",
    pathway:
      "MPS 对同等蛋白/训练刺激的反应降低 20–40%（anabolic resistance）；NMJ 失稳早于明显萎缩。",
    features: "慢性、进行性；运动单位丢失与 II 型纤维优先萎缩。",
    reversible:
      "部分可逆：需 ≥35 g 优质蛋白/餐突破抵抗阈值 + 抗阻训练；NMJ 退变的可逆性仍有争议。",
    refs: [
      {
        label: "PMC8131552",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8131552/",
      },
      {
        label: "PMID:30312372",
        url: "https://pubmed.ncbi.nlm.nih.gov/30312372/",
      },
    ],
  },
  {
    id: "cachexia",
    label: "恶病质（cachexia）",
    trigger:
      "系统性炎症 + 肿瘤因子：TNF-α→NF-κB、IL-6→JAK/STAT3、TWEAK→Fn14 协同放大。",
    pathway:
      "分解代谢亢进：UPS 与自噬持续强激活，caspase-3 参与肌丝解体；合成侧同时被压制。",
    features: "肿瘤、CKD、COPD、重症感染背景；体重快速下降且厌食。",
    reversible:
      "难逆转，需治疗原发病；ActRIIB 阻断（bimagrumab）与 STAT3 抑制在模型中可保留肌量。",
    refs: [
      {
        label: "PMID:15479644",
        url: "https://pubmed.ncbi.nlm.nih.gov/15479644/",
      },
      {
        label: "PMID:20947011",
        url: "https://pubmed.ncbi.nlm.nih.gov/20947011/",
      },
    ],
  },
];

export default function LossTabs() {
  const [active, setActive] = useState("deficit");
  const s = STATES.find((x) => x.id === active)!;

  return (
    <div className="tabs" style={{ margin: 0 }}>
      <div className="tabs__bar" role="tablist">
        {STATES.map((x) => (
          <button
            key={x.id}
            role="tab"
            type="button"
            aria-selected={x.id === active}
            className="tabs__btn"
            onClick={() => setActive(x.id)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="tabs__panel" role="tabpanel">
        <p>
          <strong>触发轴：</strong>
          {s.trigger}
        </p>
        <p>
          <strong>通路特征：</strong>
          {s.pathway}
        </p>
        <p>
          <strong>临床/场景特征：</strong>
          {s.features}
        </p>
        <p>
          <strong>可逆性：</strong>
          {s.reversible}
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            margin: 0,
          }}
        >
          文献：
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
    </div>
  );
}
