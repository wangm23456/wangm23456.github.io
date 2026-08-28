import type { EvidenceClaim, EvidenceSource } from "../../components/EvidenceIndex";

/**
 * 减重药物综述的共享证据数据。
 *
 * 数据来源：FDA / EMA / PubMed 等公开摘要核验。
 * 其他文章或未来文章可以复制并按需增减条目。
 */

export const EVIDENCE_SOURCES: EvidenceSource[] = [
  { id: "drucker-2018", label: "Drucker 2018 · Cell Metabolism", detail: "GLP-1 药理机制综述", level: "B", url: "https://doi.org/10.1016/j.cmet.2018.03.001" },
  { id: "step-1", label: "Wilding 2021 · STEP 1 · NEJM", detail: "semaglutide 2.4 mg，68 周，肥胖成人随机试验", level: "A", url: "https://doi.org/10.1056/NEJMoa2032183" },
  { id: "surmount-1", label: "Jastreboff 2022 · SURMOUNT-1 · NEJM", detail: "tirzepatide，72 周，肥胖成人随机试验", level: "A", url: "https://doi.org/10.1056/NEJMoa2206038" },
  { id: "retatrutide", label: "Jastreboff 2023 · Retatrutide · NEJM", detail: "GLP-1/GIP/glucagon 三靶激动剂二期试验", level: "A", url: "https://doi.org/10.1056/NEJMoa2301972" },
  { id: "redefine-1", label: "Garvey 2025 · REDEFINE-1 · NEJM", detail: "CagriSema，68 周，肥胖成人随机试验", level: "A", url: "https://doi.org/10.1056/NEJMoa2502081" },
  { id: "select", label: "Lincoff 2023 · SELECT · NEJM", detail: "无糖尿病、超重/肥胖且有心血管疾病人群", level: "A", url: "https://doi.org/10.1056/NEJMoa2307563" },
  { id: "soul", label: "McGuire 2025 · SOUL · NEJM", detail: "口服 semaglutide 与高风险 2 型糖尿病心血管结局", level: "A", url: "https://doi.org/10.1056/NEJMoa2501006" },
  { id: "flow", label: "Perkovic 2024 · FLOW · NEJM", detail: "2 型糖尿病合并慢性肾病人群肾脏结局", level: "A", url: "https://doi.org/10.1056/NEJMoa2403347" },
  { id: "step-hfpef", label: "Kosiborod 2023 · STEP-HFpEF · NEJM", detail: "肥胖合并射血分数保留型心衰人群", level: "A", url: "https://doi.org/10.1056/NEJMoa2306963" },
  { id: "summit", label: "Packer 2024 · SUMMIT · NEJM", detail: "tirzepatide 与肥胖合并 HFpEF 结局", level: "A", url: "https://doi.org/10.1056/NEJMoa2410027" },
  { id: "surmount-osa", label: "Malhotra 2024 · SURMOUNT-OSA · NEJM", detail: "肥胖合并阻塞性睡眠呼吸暂停", level: "A", url: "https://doi.org/10.1056/NEJMoa2404881" },
  { id: "essence", label: "Sanyal 2025 · ESSENCE · NEJM", detail: "代谢功能障碍相关脂肪性肝炎", level: "A", url: "https://doi.org/10.1056/NEJMoa2413258" },
  { id: "cagrilintide", label: "Lau 2021 · Cagrilintide · Lancet", detail: "长效胰淀素类似物二期剂量探索", level: "B", url: "https://doi.org/10.1016/S0140-6736(21)01751-7" },
  { id: "surmount-4", label: "Aronne 2024 · SURMOUNT-4 · JAMA", detail: "tirzepatide 撤药/维持随机试验", level: "A", url: "https://doi.org/10.1001/jama.2023.24945" },
  { id: "believe", label: "Heymsfield 2026 · BELIEVE · Nature Medicine", detail: "bimagrumab 与 semaglutide 联用的二期研究", level: "B", url: "https://doi.org/10.1038/s41591-026-04204-0" },
  { id: "ema-prac", label: "EMA PRAC 2024（审查始于 2023）", detail: "GLP-1 类药物与自杀意念/自伤信号审查", level: "E", url: "https://www.ema.europa.eu/en/news/prac-concludes-glp-1-receptor-agonists-no-causal-association-suicidal-thoughts" },
  { id: "surmount-dxa", label: "Look 2025 · SURMOUNT-1 DXA · Diabetes Obesity and Metabolism", detail: "SURMOUNT-1 的 160 人 DXA 体成分子研究", level: "B", url: "https://doi.org/10.1111/dom.16275" },
  { id: "step-teens", label: "Weghuber 2022 · STEP TEENS · NEJM", detail: "semaglutide 2.4 mg，68 周，青少年肥胖随机试验", level: "A", url: "https://doi.org/10.1056/NEJMoa2208601" },
  { id: "orforglipron", label: "Wharton 2023 · Orforglipron · NEJM", detail: "口服非肽 GLP-1 激动剂二期试验", level: "A", url: "https://doi.org/10.1056/NEJMoa2302392" },
  { id: "setmelanotide", label: "Clément 2020 · Setmelanotide · Lancet Diabetes Endocrinology", detail: "POMC/LEPR 缺陷相关遗传性肥胖 III 期研究", level: "A", url: "https://doi.org/10.1016/S2213-8587(20)30364-8" },
];

export const EVIDENCE_CLAIMS: EvidenceClaim[] = [
  { id: "mechanism", section: "机制", text: "GLP-1 类药物主要通过减少食欲、延缓胃排空和改善葡萄糖依赖性胰岛素分泌影响体重。", result: "综述汇总显示，GLP-1 信号同时作用于摄食调节、胃排空和胰岛素分泌；这些是药物改变体重和血糖的主要生理环节。", basis: "药理机制综述，非单一临床试验。", level: "B", sourceIds: ["drucker-2018"] },
  { id: "step-1-weight", section: "体重疗效", text: "semaglutide 2.4 mg 在 STEP 1 中使用 68 周后平均体重变化约 −14.9%。", result: "随机试验报告 semaglutide 组平均 −14.9%，安慰剂组约 −2.4%。", basis: "肥胖成人随机试验；结果适用于研究人群、剂量和 68 周随访窗口。", level: "A", sourceIds: ["step-1"] },
  { id: "surmount-1-weight", section: "体重疗效", text: "tirzepatide 15 mg 在 SURMOUNT-1 中使用 72 周后平均体重变化约 −20.9%。", result: "随机试验报告 15 mg 组平均 −20.9%；5 mg 和 10 mg 组分别约 −15.0% 和 −19.5%，安慰剂组约 −3.1%。", basis: "肥胖成人随机试验；不同剂量不能合并为单一效果。", level: "A", sourceIds: ["surmount-1"] },
  { id: "retatrutide-weight", section: "研发管线", text: "Retatrutide 二期试验中，12 mg 组 48 周平均体重变化约 −24.2%。", result: "二期试验报告 12 mg 组 48 周平均体重变化约 −24.2%，安慰剂组约 −2.1%。", basis: "这是二期研究结果，不能替代上市药物的长期安全性证据。", level: "A", sourceIds: ["retatrutide"] },
  { id: "cagrisema-weight", section: "研发管线", text: "REDEFINE-1 报告 CagriSema 68 周平均体重变化约 −20.4%。", result: "正式论文报告 CagriSema 组 68 周平均体重变化约 −20.4%，安慰剂组约 −3.0%。", basis: "cagrilintide 与 semaglutide 联合的关键 III 期研究。", level: "A", sourceIds: ["redefine-1"] },
  { id: "cagrilintide-weight", section: "研发管线", text: "Cagrilintide 单药二期显示剂量相关的体重下降。", result: "26 周剂量探索研究中，各剂量组减重约 6.0%–10.8%，安慰剂组约 3.0%。", basis: "结果范围取决于剂量组和分析集。", level: "B", sourceIds: ["cagrilintide"] },
  { id: "mace-select", section: "临床结局", text: "在无糖尿病但已有心血管疾病的超重/肥胖人群中，semaglutide 降低三点 MACE 风险约 20%。", result: "SELECT 报告三点 MACE：semaglutide 组约 6.5%，安慰剂组约 8.0%；HR 0.80，95% CI 0.72–0.90。", basis: "预设心血管结局；结果不能外推到没有相同基线风险的人群。", level: "A", sourceIds: ["select"] },
  { id: "oral-cv", section: "临床结局", text: "口服 semaglutide 的心血管结局证据来自高风险 2 型糖尿病人群。", result: "SOUL 纳入 9650 人，MACE 发生于口服 semaglutide 组 12.0%、安慰剂组 13.8%；HR 0.86，95% CI 0.77–0.96。", basis: "研究对象为 2 型糖尿病合并动脉粥样硬化性心血管病、慢性肾病或两者兼有，不能直接外推到所有减重人群。", level: "A", sourceIds: ["soul"] },
  { id: "kidney", section: "临床结局", text: "semaglutide 在 2 型糖尿病合并慢性肾病人群中改善肾脏复合结局。", result: "FLOW 纳入 3533 人；主要肾脏复合终点首次事件为 331 vs 410，HR 0.76，95% CI 0.66–0.88；相对风险下降约 24%。", basis: "肾脏结局试验；研究剂量为 semaglutide 1.0 mg/周，不能写成一般减重人群的肾脏处方结论。", level: "A", sourceIds: ["flow"] },
  { id: "functional-outcomes", section: "临床结局", text: "部分 HFpEF、OSA 和 MASH 研究显示症状、功能或疾病相关结局改善。", result: "STEP-HFpEF：KCCQ-CSS +16.6 vs +8.7，6 分钟步行 +21.5 m vs +1.2 m；SUMMIT：心血管死亡或心衰恶化 9.9% vs 15.3%，HR 0.62；SURMOUNT-OSA 两项试验的 AHI 变化分别为 −25.3 vs −5.3、−29.3 vs −5.5 次/小时；ESSENCE：MASH 缓解 62.9% vs 34.3%，纤维化改善 36.8% vs 22.4%。", basis: "这些结果来自四类不同的特定合并症人群，终点也不同，不能合并理解为所有使用者都会获得同类获益。", level: "A", sourceIds: ["step-hfpef", "summit", "surmount-osa", "essence"] },
  { id: "ffm", section: "减重质量", text: "减重期间可能同时发生脂肪量和 FFM 下降，但 FFM 下降不能直接等同于骨骼肌下降。", result: "SURMOUNT-1 DXA 子研究纳入 160 人：tirzepatide 组体重、脂肪量和瘦体重分别变化 −21.3%、−33.9% 和 −10.9%；约 75% 的减重来自脂肪量，25% 来自瘦体重。", basis: "DXA 的 lean mass/FFM 包含非脂肪组织，并非纯骨骼肌；子研究样本小于主试验，且需结合力量和功能指标。", level: "B", sourceIds: ["surmount-dxa"] },
  { id: "orforglipron-weight", section: "口服研发药物", text: "Orforglipron 二期试验显示口服非肽 GLP-1 激动剂可产生剂量相关的体重下降。", result: "272 人随机试验中，第 36 周各剂量组平均体重变化为 −9.4% 至 −14.7%，安慰剂组 −2.3%；达到至少 10% 减重者为 46%–75%，安慰剂组 9%。", basis: "二期、36 周研究；胃肠道事件和停药率仍需在更大、更长期试验中判断。", level: "A", sourceIds: ["orforglipron"] },
  { id: "step1-response", section: "体重疗效", text: "平均减重不能代表所有参与者，STEP 1 同时报告了多个减重阈值的应答率。", result: "第 68 周达到至少 5%、10%、15% 减重者，semaglutide 组分别为 86.4%、69.1%、50.5%，安慰剂组分别为 31.5%、12.0%、4.9%。", basis: "应答率能补充平均值，但仍不预测单个使用者一定达到某个阈值。", level: "A", sourceIds: ["step-1"] },
  { id: "step1-gi", section: "胃肠道耐受", text: "Semaglutide 的胃肠道反应多见，部分参与者因此停药。", result: "STEP 1 摘要报告恶心和腹泻最常见，通常为暂时性、轻至中度；因胃肠道事件永久停药者为 4.5%，安慰剂组 0.8%。", basis: "摘要未给出所有单项胃肠道事件的完整发生率，不能用停药率替代总体发生率。", level: "A", sourceIds: ["step-1"] },
  { id: "surmount1-gi", section: "胃肠道耐受", text: "Tirzepatide 的胃肠道事件主要出现在剂量递增期，并呈剂量相关停药差异。", result: "SURMOUNT-1 中，因不良事件停药者在 5、10、15 mg 组分别为 4.3%、7.1%、6.2%，安慰剂组 2.6%；常见事件主要为轻至中度胃肠道反应。", basis: "这是整体不良事件停药率，不等同于单项恶心或呕吐发生率。", level: "A", sourceIds: ["surmount-1"] },
  { id: "retatrutide-safety", section: "研发药物安全", text: "Retatrutide 二期试验出现剂量相关胃肠道反应和心率变化。", result: "胃肠道事件多为轻至中度，较低起始剂量可部分缓解；心率随剂量升高，在第 24 周达到峰值，之后下降。", basis: "二期试验规模和随访时间不足以确定罕见或长期安全风险。", level: "A", sourceIds: ["retatrutide"] },
  { id: "cagrisema-gi", section: "胃肠道耐受", text: "CagriSema 的减重效果伴随较高的胃肠道事件比例。", result: "REDEFINE-1 中胃肠道不良事件发生于 CagriSema 组 79.6%、安慰剂组 39.9%；主要包括恶心、呕吐、腹泻、便秘和腹痛，多为暂时性、轻至中度。", basis: "总体胃肠道事件比例不能说明每种症状的独立发生率或严重程度。", level: "A", sourceIds: ["redefine-1"] },
  { id: "step-teens", section: "特殊人群", text: "青少年 semaglutide 证据来自 STEP TEENS，不能直接外推到更低龄儿童。", result: "第 68 周 BMI 平均变化为 semaglutide 组 −16.1%、安慰剂组 +0.6%；达到至少 5% 体重下降者为 73% vs 18%。", basis: "研究对象是青少年肥胖人群，并有生活方式干预；年龄、成长发育和长期安全性需单独评估。", level: "A", sourceIds: ["step-teens"] },
  { id: "setmelanotide-genetic", section: "特殊人群", text: "Setmelanotide 的证据针对特定遗传性肥胖，不能作为普通肥胖的通用疗效。", result: "约 1 年时，达到至少 10% 体重下降者在 POMC 缺陷组为 80%，LEPR 缺陷组为 45%，同时观察到饥饿评分下降。", basis: "开放标签、单臂、罕见病研究；适用范围由遗传诊断决定。", level: "A", sourceIds: ["setmelanotide"] },
  { id: "weight-regain", section: "长期结局", text: "停药或切换安慰剂后，体重可能明显回升。", result: "SURMOUNT-4 导入期平均减重 20.9%；第 36–88 周持续 tirzepatide 组再变化 −5.5%，切换安慰剂组 +14.0%；组间差 −19.4 个百分点。", basis: "这是随机撤药设计，说明持续治疗与撤药后的平均差异；不能由此推出个人停药方案。", level: "A", sourceIds: ["surmount-4"] },
  { id: "mental-signal", section: "安全信号", text: "目前没有足够证据确认 GLP-1 与自杀意念之间的因果关系，但上市后信号仍需监测。", result: "EMA PRAC 在审查现有临床试验、上市后报告和其他数据后，结论是不支持 GLP-1 受体激动剂与自杀或自伤想法/行为之间的因果关联。", basis: "监管信号审查不是随机试验；“未确认因果”不等于任何个体都不会出现精神症状。", level: "E", sourceIds: ["ema-prac"] },
  { id: "bimagrumab-direction", section: "减重质量", text: "bimagrumab/BELIEVE 把保留瘦体重作为研发方向，而不是 GLP-1 类药物的普遍治疗目标。", result: "BELIEVE 纳入 507 人；48 周体重变化：bimagrumab 30 mg/kg −9.3 kg、semaglutide 2.4 mg −14.2 kg、高剂量联合 −17.8 kg、安慰剂 −3.3 kg。摘要说明 bimagrumab 的研发目标包括减少脂肪和促进肌肉增长，但摘要未给出可用于本文的具体瘦体重数字。", basis: "二期研究的主要终点是体重；不能仅凭研发目标或体重结果断言长期保肌获益。", level: "B", sourceIds: ["believe"] },
];
