import type { Term } from '../../components/Glossary';

/**
 * 通用词条数据。
 *
 * 当前由减重药物综述文章使用；未来文章可以按需复用，
 * 也可以在传入 `<GlossaryPanel terms={...} />` 时只挑出需要的子集。
 */
export const GLOSSARY_TERMS: Term[] = [
  {
    id: "incretin",
    abbr: "Incretin",
    cn: "肠促胰素",
    refs: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Incretin" },
    ],
    abstract: {
      zh: "餐后由肠道分泌、调节胰岛素分泌和饱腹感的多肽激素家族。",
      en: "A family of gut-derived peptide hormones that modulate insulin secretion and satiety after meals.",
    },
    inArticle: {
      zh: "GLP-1 RA 与 GIP RA 都属于肠促胰素类；是文中讨论的减重药物主要分子基础。",
      en: "GLP-1 RA and GIP RA belong to this family and form the molecular basis of the weight-loss drugs discussed here.",
    },
  },
  {
    id: "ffm",
    abbr: "FFM",
    cn: "瘦体重",
    refs: [
      {
        label: "Wikipedia · Lean body mass",
        url: "https://en.wikipedia.org/wiki/Lean_body_mass",
      },
    ],
    abstract: {
      zh: "Fat-free mass，除脂肪以外的身体质量，包含肌肉、水分、骨骼、器官和结缔组织。",
      en: "Fat-free mass: all body mass excluding stored fat, including muscle, water, bone, organs and connective tissue.",
    },
    inArticle: {
      zh: "DXA 报告的 FFM 不等同于骨骼肌。评估肌肉流失时还应结合力量、功能和炎症等指标。",
      en: "DXA-reported FFM is not equivalent to skeletal muscle; muscle loss assessment needs strength, function and inflammation indicators.",
    },
  },
  {
    id: "estimand",
    abbr: "Estimand",
    cn: "目标治疗效应",
    refs: [],
    abstract: {
      zh: "临床试验预先定义的治疗效应，包括研究人群、终点、如何处理停药和补救治疗等事件。",
      en: "A precise definition of the treatment effect, including population, endpoint and handling of intercurrent events.",
    },
    inArticle: {
      zh: "同一试验的 treatment-policy estimand 与 trial-product estimand 可能给出不同减重数字，比较药物时必须看清分析口径。",
      en: "Treatment-policy and trial-product estimands can yield different weight-loss values; cross-trial comparisons require the same analytic lens.",
    },
  },
  {
    id: "hr-ci",
    abbr: "HR / 95% CI",
    cn: "风险比与置信区间",
    refs: [],
    abstract: {
      zh: "HR 比较两组事件发生速率；95% CI 表示估计值的不确定范围。对保护性结局，HR 小于 1 通常代表试验组风险较低。",
      en: "Hazard ratio compares event rates over time; the 95% confidence interval describes uncertainty around the estimate.",
    },
    inArticle: {
      zh: "SELECT、SOUL、FLOW 和 SUMMIT 的结局不能只看相对下降百分比，还要看事件率、HR 和 95% CI。",
      en: "SELECT, SOUL, FLOW and SUMMIT should be read using event rates, HR and 95% CI, not relative reduction alone.",
    },
  },
  {
    id: "ahi",
    abbr: "AHI",
    cn: "呼吸暂停低通气指数",
    refs: [],
    abstract: {
      zh: "每小时睡眠中呼吸暂停和低通气事件的次数，用于评价阻塞性睡眠呼吸暂停严重程度。",
      en: "The number of apnea and hypopnea events per hour of sleep, used to grade obstructive sleep apnea severity.",
    },
    inArticle: {
      zh: "SURMOUNT-OSA 的主要终点。AHI 变化是疾病特异结局，不能直接换算成一般减重获益。",
      en: "The primary endpoint in SURMOUNT-OSA; it is disease-specific and cannot be translated directly into general weight-loss benefit.",
    },
  },
  {
    id: "kccq",
    abbr: "KCCQ-CSS",
    cn: "堪萨斯城心肌病问卷临床汇总分",
    refs: [],
    abstract: {
      zh: "评价心衰症状和身体限制的患者报告结局，分数越高通常代表健康状态越好。",
      en: "A patient-reported measure of heart-failure symptoms and physical limitations; higher scores indicate better health status.",
    },
    inArticle: {
      zh: "STEP-HFpEF 和 SUMMIT 用它评价症状与功能变化，不能把分数变化理解为死亡风险变化。",
      en: "Used in STEP-HFpEF and SUMMIT for symptoms and function; score changes are not mortality-risk changes.",
    },
  },
  {
    id: "mash",
    abbr: "MASH",
    cn: "代谢功能障碍相关脂肪性肝炎",
    refs: [],
    abstract: {
      zh: "由代谢功能障碍相关脂肪性肝病发展出的炎症性肝病，可伴随不同程度纤维化。",
      en: "An inflammatory liver disease within metabolic dysfunction-associated steatotic liver disease, often accompanied by fibrosis.",
    },
    inArticle: {
      zh: "ESSENCE 使用肝活检评价 MASH 缓解和纤维化改善，属于组织学终点。",
      en: "ESSENCE used biopsy-based MASH resolution and fibrosis improvement as histologic endpoints.",
    },
  },
  {
    id: "egfr",
    abbr: "eGFR",
    cn: "估算肾小球滤过率",
    refs: [],
    abstract: {
      zh: "根据血肌酐等信息估算肾脏过滤功能的指标，数值下降通常提示肾功能减弱。",
      en: "An estimate of kidney filtration function based on serum creatinine and other variables.",
    },
    inArticle: {
      zh: "FLOW 的入组标准和肾脏结局包含 eGFR 范围、下降速度和肾衰竭事件。",
      en: "FLOW used eGFR ranges, decline and kidney-failure events in eligibility and outcomes.",
    },
  },
  {
    id: "mace",
    abbr: "MACE",
    cn: "主要不良心血管事件",
    refs: [],
    abstract: {
      zh: "临床试验常用的心血管复合终点，通常包括心血管死亡、非致死性心肌梗死和非致死性卒中。",
      en: "A cardiovascular composite endpoint commonly including cardiovascular death, nonfatal myocardial infarction and nonfatal stroke.",
    },
    inArticle: {
      zh: "SELECT 和 SOUL 使用三点 MACE。比较结果时应同时看事件率、HR 和 95% CI。",
      en: "SELECT and SOUL used three-point MACE; interpretation requires event rates, HR and 95% CI.",
    },
  },
  { id: "glp1", abbr: "GLP-1", cn: "胰高血糖素样肽-1", refs: [], abstract: { zh: "餐后帮助产生饱腹感、调节血糖的肠道激素。药物只是延长或模拟这种信号。", en: "A gut hormone that promotes satiety and helps regulate blood glucose after meals." }, inArticle: { zh: "文章中大多数新型减重药的核心作用通路。", en: "The core pathway for most newer weight-loss drugs discussed here." } },
  { id: "glp1ra", abbr: "GLP-1 RA", cn: "GLP-1 受体激动剂", refs: [], abstract: { zh: "模拟 GLP-1 作用的药物，如 semaglutide 和 liraglutide。", en: "Drugs that mimic GLP-1, such as semaglutide and liraglutide." }, inArticle: { zh: "主要通过减少食欲、延缓胃排空和改善血糖发挥作用。", en: "Acts mainly through appetite reduction, slower gastric emptying and improved glucose control." } },
  { id: "gip", abbr: "GIP / GIPR", cn: "葡萄糖依赖性促胰岛素多肽及其受体", refs: [], abstract: { zh: "另一条肠促胰素通路。替尔泊肽同时作用于 GIPR 和 GLP-1R。", en: "Another incretin pathway; tirzepatide acts at both GIPR and GLP-1R." }, inArticle: { zh: "用于解释替尔泊肽与单靶 GLP-1 药物的差异。", en: "Explains how tirzepatide differs from single-target GLP-1 drugs." } },
  { id: "glucagon", abbr: "Glucagon", cn: "胰高血糖素", refs: [], abstract: { zh: "参与升高血糖和调节能量消耗的激素。", en: "A hormone involved in raising blood glucose and regulating energy expenditure." }, inArticle: { zh: "Retatrutide 增加这一作用通路，理论上可能提高能量消耗。", en: "Retatrutide adds this pathway and may theoretically increase energy expenditure." } },
  { id: "semaglutide", abbr: "Semaglutide", cn: "司美格鲁肽", refs: [], abstract: { zh: "一种长效 GLP-1 受体激动剂，存在注射和口服制剂。", en: "A long-acting GLP-1 receptor agonist available in injectable and oral forms." }, inArticle: { zh: "STEP 试验和 SELECT 等研究中的主要药物。", en: "The main drug in STEP trials and SELECT." } },
  { id: "tirzepatide", abbr: "Tirzepatide", cn: "替尔泊肽", refs: [], abstract: { zh: "同时作用于 GLP-1R 和 GIPR 的长效药物。", en: "A long-acting drug acting at both GLP-1R and GIPR." }, inArticle: { zh: "SURMOUNT 系列和 SUMMIT 研究中的主要药物。", en: "The main drug in the SURMOUNT series and SUMMIT." } },
  { id: "retatrutide", abbr: "Retatrutide", cn: "三靶激动剂", refs: [], abstract: { zh: "同时作用于 GLP-1R、GIPR 和胰高血糖素受体的研发药物。", en: "An investigational agonist of GLP-1R, GIPR and the glucagon receptor." }, inArticle: { zh: "二期减重效果很强，但长期安全性还不能确定。", en: "It showed strong phase 2 weight loss, but long-term safety remains uncertain." } },
  { id: "cagrisema", abbr: "CagriSema", cn: "cagrilintide 与 semaglutide 联合方案", refs: [], abstract: { zh: "把胰淀素类似物和 GLP-1 药物组合在一起的减重方案。", en: "A weight-management combination of an amylin analogue and a GLP-1 drug." }, inArticle: { zh: "REDEFINE-1 的研究方案。", en: "The intervention studied in REDEFINE-1." } },
  { id: "cagrilintide", abbr: "Cagrilintide", cn: "长效胰淀素类似物", refs: [], abstract: { zh: "模拟胰淀素饱腹信号的研发药物。", en: "An investigational drug that mimics amylin satiety signaling." }, inArticle: { zh: "CagriSema 的组成成分，也有单药二期研究。", en: "A component of CagriSema, also studied alone in phase 2." } },
  { id: "orforglipron", abbr: "Orforglipron", cn: "口服非肽 GLP-1 激动剂", refs: [], abstract: { zh: "不需要注射的口服小分子 GLP-1 受体激动剂。", en: "An oral small-molecule GLP-1 receptor agonist that does not require injection." }, inArticle: { zh: "关注口服给药是否能降低使用负担，而不是自动消除副作用。", en: "Its value is the oral route, not an automatic removal of adverse effects." } },
  { id: "setmelanotide", abbr: "Setmelanotide", cn: "MC4R 激动剂", refs: [], abstract: { zh: "针对特定遗传性肥胖通路缺陷的药物。", en: "A drug targeting specific genetic defects in the obesity pathway." }, inArticle: { zh: "不能把遗传性肥胖研究结果外推到普通肥胖。", en: "Results in genetic obesity cannot be generalized to common obesity." } },
  { id: "bimagrumab", abbr: "Bimagrumab", cn: "ActRII 抗体", refs: [], abstract: { zh: "阻断激活素 II 型受体的研发抗体，研究目标包括减脂和促进肌肉生长。", en: "An investigational activin type II receptor antibody studied for fat reduction and muscle growth." }, inArticle: { zh: "属于潜在保留瘦体重的研发方向，不是 GLP-1 的普遍目标。", en: "A potential lean-mass-preserving direction, not the general goal of GLP-1 drugs." } },
  { id: "gastric-emptying", abbr: "Gastric emptying", cn: "胃排空", refs: [], abstract: { zh: "食物从胃进入小肠的过程。速度变慢会延长饱腹感，也可能增加恶心和围手术期风险。", en: "The movement of food from the stomach into the small intestine." }, inArticle: { zh: "GLP-1 类药物常见的生理作用之一。", en: "One of the common physiological effects of GLP-1 drugs." } },
  { id: "appetite", abbr: "Appetite", cn: "食欲", refs: [], abstract: { zh: "由饥饿、饱腹和食物奖赏共同影响的进食驱动力。", en: "The drive to eat shaped by hunger, satiety and food reward." }, inArticle: { zh: "药物主要改变的是食欲和能量摄入。", en: "The drugs mainly alter appetite and energy intake." } },
  { id: "gi-adverse-events", abbr: "GI adverse events", cn: "胃肠道不良事件", refs: [], abstract: { zh: "恶心、呕吐、腹泻、便秘和腹痛等不良反应的统称。", en: "A group of adverse effects including nausea, vomiting, diarrhea, constipation and abdominal pain." }, inArticle: { zh: "通常在剂量递增期更明显。", en: "Often more prominent during dose escalation." } },
  { id: "dose-escalation", abbr: "Dose escalation", cn: "剂量递增", refs: [], abstract: { zh: "从低剂量开始，按计划逐步提高剂量的过程。", en: "A planned process of gradually increasing the dose from a low starting level." }, inArticle: { zh: "用于改善耐受性，但不保证所有人都能达到最高剂量。", en: "Used to improve tolerability, but not everyone reaches the highest dose." } },
  { id: "placebo", abbr: "Placebo", cn: "安慰剂", refs: [], abstract: { zh: "外观和给药方式相似、但不含研究药物有效成分的对照。", en: "A control that resembles the intervention but lacks its active ingredient." }, inArticle: { zh: "药物效果通常要与安慰剂组比较，而不是只看治疗组变化。", en: "Drug effects should be compared with placebo, not read from the treatment group alone." } },
  { id: "rct", abbr: "RCT", cn: "随机对照试验", refs: [], abstract: { zh: "把参与者随机分组并比较干预与对照的研究设计。", en: "A design that randomly assigns participants to intervention and control groups." }, inArticle: { zh: "体重和临床结局部分主要来自 RCT。", en: "Many weight and clinical-outcome claims come from RCTs." } },
  { id: "adverse-event", abbr: "Adverse event", cn: "不良事件", refs: [], abstract: { zh: "研究期间发生的健康问题，不一定已经证明由药物导致。", en: "A health event occurring during a study, not necessarily caused by the drug." }, inArticle: { zh: "不良事件发生率不能自动等于药物因果风险。", en: "An adverse-event rate does not automatically establish drug causality." } },
  { id: "placebo-response", abbr: "Treatment difference", cn: "组间治疗差异", refs: [], abstract: { zh: "干预组和对照组变化相减后的差异，通常比单看组内变化更有解释力。", en: "The difference between intervention and control changes, often more informative than within-group change." }, inArticle: { zh: "用于避免把自然变化或安慰剂反应误算成药物效果。", en: "Helps avoid attributing natural change or placebo response to the drug." } },
  { id: "osa", abbr: "OSA", cn: "阻塞性睡眠呼吸暂停", refs: [], abstract: { zh: "睡眠时上气道反复阻塞，导致呼吸暂停和低通气。", en: "Repeated upper-airway obstruction during sleep causing apneas and hypopneas." }, inArticle: { zh: "SURMOUNT-OSA 的目标疾病。", en: "The target condition in SURMOUNT-OSA." } },
  { id: "hfpef", abbr: "HFpEF", cn: "射血分数保留型心力衰竭", refs: [], abstract: { zh: "心脏射血分数保留、但舒张充盈和运动耐量受损的一类心衰。", en: "Heart failure with preserved ejection fraction, often involving impaired filling and exercise capacity." }, inArticle: { zh: "STEP-HFpEF 和 SUMMIT 的特定研究人群。", en: "A specific study population in STEP-HFpEF and SUMMIT." } },
  { id: "fibrosis", abbr: "Fibrosis", cn: "肝纤维化", refs: [], abstract: { zh: "慢性肝损伤后胶原和瘢痕组织逐渐积累的过程。", en: "The accumulation of collagen and scar tissue after chronic liver injury." }, inArticle: { zh: "ESSENCE 研究中的肝脏组织学结局之一。", en: "One of the liver histology outcomes in ESSENCE." } },
  { id: "heart-rate", abbr: "Heart rate", cn: "心率", refs: [], abstract: { zh: "心脏每分钟搏动次数。某些研发药物试验会将其作为安全性指标观察。", en: "The number of heartbeats per minute, monitored as a safety measure in some trials." }, inArticle: { zh: "Retatrutide 二期中观察到剂量相关变化。", en: "A dose-related change was observed in the retatrutide phase 2 trial." } },
  { id: "glp1r", abbr: "GLP-1R", cn: "GLP-1 受体", refs: [], abstract: { zh: "细胞表面的 GLP-1 结合受体，药物激活后传递食欲和血糖调节信号。", en: "The cell-surface receptor for GLP-1 that transmits appetite and glucose-regulation signals." }, inArticle: { zh: "药物直接作用的受体名称。", en: "The receptor directly targeted by the drugs." } },
  { id: "bmi", abbr: "BMI", cn: "体重指数", refs: [], abstract: { zh: "用体重和身高估算体型的指标，不能单独代表脂肪量或健康状况。", en: "A weight-to-height index that does not independently represent fat mass or health." }, inArticle: { zh: "试验常用的入组和分层指标。", en: "A common eligibility and stratification measure in trials." } },
  { id: "hr-ci", abbr: "HR / 95% CI", cn: "风险比与置信区间", refs: [], abstract: { zh: "HR 比较两组随时间发生事件的风险，95% CI 表示估计值的不确定范围。", en: "HR compares event risk over time; 95% CI describes uncertainty around the estimate." }, inArticle: { zh: "用于理解 SELECT、SOUL 和 FLOW 的临床结局数字。", en: "Used to interpret clinical-outcome estimates in SELECT, SOUL and FLOW." } },
  { id: "ree", abbr: "REE", cn: "静息能量消耗", refs: [], abstract: { zh: "人在静息状态下维持生命活动所消耗的能量。", en: "Energy expended at rest to maintain vital functions." }, inArticle: { zh: "文章用它讨论减重后的能量消耗变化，但不把变化简单归因于药物。", en: "Used to discuss energy-expenditure changes after weight loss without simple drug attribution." } },
  { id: "dose-escalation", abbr: "Dose escalation", cn: "剂量递增", refs: [], abstract: { zh: "从较低剂量开始，按计划逐步增加剂量以改善耐受性的过程。", en: "A planned increase from a lower starting dose to improve tolerability." }, inArticle: { zh: "胃肠道不良事件常在剂量递增期更明显。", en: "GI adverse events are often more prominent during escalation." } },
];
