import type { Term } from "../../components/Glossary";

export const ADHD_CIRCADIAN_GLOSSARY_TERMS: Term[] = [
  {
    id: "dlmo",
    abbr: "DLMO",
    cn: "弱光褪黑素起始分泌时间",
    refs: [
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/20163790/" },
    ],
    abstract: {
      zh: "在极低光照（<10 lux）下，松果体夜间褪黑素分泌突破基线阈值的时间点，是测定人体内源性生物钟相位的金标准。",
      en: "Dim-Light Melatonin Onset: the gold-standard biomarker for endogenous circadian phase measured in saliva or plasma under dim light.",
    },
    inArticle: {
      zh: "成人 ADHD 患者平均推迟约 90 分钟，儿童推迟约 45 分钟，也是计算微量外源褪黑素给药窗口（DLMO 前 3–4 小时）的基准点。",
      en: "Delayed by ~90 min in adults and ~45 min in children with ADHD; serves as the anchor for timing low-dose exogenous melatonin.",
    },
  },
  {
    id: "scn",
    abbr: "SCN",
    cn: "下丘脑视交叉上核",
    refs: [
      {
        label: "NCBI Bookshelf",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK546664/",
      },
    ],
    abstract: {
      zh: "位于下丘脑前部的哺乳动物主生物钟起搏器，直接接收视网膜光信号并同步全身外周细胞时钟。",
      en: "Suprachiasmatic Nucleus: the master circadian pacemaker in the hypothalamus that entrains peripheral clocks to the light-dark cycle.",
    },
    inArticle: {
      zh: "晨间强光疗法（BLT）与定时微量褪黑素直接作用的核心神经解剖靶标。",
      en: "The primary neuroanatomical target of morning bright light therapy and timed low-dose melatonin.",
    },
  },
  {
    id: "bmal1-per2",
    abbr: "BMAL1 / PER2",
    cn: "核心分子钟基因",
    refs: [
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/22105622/" },
    ],
    abstract: {
      zh: "构成细胞内 24 小时转录-翻译负反馈回路（TTFL）的核心时钟基因蛋白。",
      en: "Core clock genes forming the cellular transcription-translation feedback loop (TTFL) that drives 24-hour molecular rhythms.",
    },
    inArticle: {
      zh: "成人 ADHD 患者口腔黏膜细胞中 BMAL1 与 PER2 的 24 小时正弦波节律显著衰减甚至消失，且衰减幅度与症状严重度相关。",
      en: "Rhythmic expression of BMAL1 and PER2 is significantly blunted in oral mucosa of adults with ADHD, tracking with symptom severity.",
    },
  },
  {
    id: "car",
    abbr: "CAR",
    cn: "皮质醇觉醒反应",
    refs: [
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/34413283/" },
    ],
    abstract: {
      zh: "清晨觉醒后 30–45 分钟内下丘脑-垂体-肾上腺（HPA）轴触发的皮质醇陡峭激增，负责唤醒皮层并启动日间代谢。",
      en: "Cortisol Awakening Response: the rapid surge in cortisol peaking 30–45 minutes after morning awakening.",
    },
    inArticle: {
      zh: "ADHD 患者的晨间皮质醇普遍低平且峰值后移，直接解释了患者清晨严重的“睡眠惯性”与唤醒困难。",
      en: "Blunted and delayed in ADHD, explaining severe morning sleep inertia and executive paralysis upon waking.",
    },
  },
  {
    id: "iprgc",
    abbr: "ipRGCs",
    cn: "内源性光敏视网膜神经节细胞",
    refs: [
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/28162893/" },
    ],
    abstract: {
      zh: "表达黑视蛋白（Melanopsin）、对 460–480nm 蓝绿光高度敏感的视网膜细胞，经视网膜下丘脑束（RHT）向 SCN 传递非视觉光授时信号。",
      en: "Intrinsically photosensitive retinal ganglion cells expressing melanopsin, projecting light zeitgeber signals to the SCN.",
    },
    inArticle: {
      zh: "受视网膜多巴胺张力调制；夜间手机屏幕蓝光通过激活 ipRGCs 强力压制松果体褪黑素分泌。",
      en: "Modulated by retinal dopamine; late-night screen blue light activates ipRGCs to suppress nocturnal melatonin onset.",
    },
  },
  {
    id: "blt",
    abbr: "BLT",
    cn: "晨间强光疗法",
    refs: [
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/28327443/" },
    ],
    abstract: {
      zh: "在清晨固定觉醒后使用 10,000 lux 全光谱（滤紫外）光疗设备照射 20–30 分钟，以强制前移生物钟相位的物理疗法。",
      en: "Bright Light Therapy: morning exposure to 10,000 lux light to advance circadian phase and suppress residual daytime melatonin.",
    },
    inArticle: {
      zh: "临床试验证实连续 2–3 周晨间 BLT 可使成人 ADHD 的 DLMO 提前 31–120 分钟，且相位前移幅度直接预测多动冲动症状的改善。",
      en: "Advances DLMO by 31–120 minutes in adult ADHD and directly predicts improvements in hyperactive-impulsive symptoms.",
    },
  },
  {
    id: "social-jetlag",
    abbr: "SJL",
    cn: "社会时差",
    refs: [
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/12581101/" },
    ],
    abstract: {
      zh: "自由休息日睡眠中点（MSF）与工作日睡眠中点（MSW）之间的绝对时间差值，反映内源生物钟与社会时钟的错配程度。",
      en: "Social Jetlag: the discrepancy between biological clock timing on free days (MSF) and socially imposed work/school days (MSW).",
    },
    inArticle: {
      zh: "晚型 ADHD 患者在朝九晚五体制下常承受 ≥2 小时的慢性社会时差，相当于每周经历一次跨时区飞行。",
      en: "Evening-type ADHD patients routinely suffer ≥2 hours of chronic social jetlag under standard 9-to-5 schedules.",
    },
  },
  {
    id: "dat-net",
    abbr: "DAT / NET",
    cn: "多巴胺 / 去甲肾上腺素转运体",
    refs: [
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/17520787/" },
    ],
    abstract: {
      zh: "位于突触前膜负责将突触间隙多巴胺与去甲肾上腺素回收的膜蛋白，是哌甲酯与托莫西汀的核心药理靶点。",
      en: "Dopamine and Norepinephrine Transporters: presynaptic proteins targeted by stimulants (methylphenidate) and atomoxetine.",
    },
    inArticle: {
      zh: "清晨阻断 DAT/NET 可提升日间觉醒并加速清除残留褪黑素，但傍晚药效消退会诱发急性多巴胺反跳与报复性熬夜。",
      en: "Morning blockade enhances daytime alertness, but evening wear-off triggers dopamine rebound and bedtime procrastination.",
    },
  },
  {
    id: "lc-alpha2a",
    abbr: "LC / α2A",
    cn: "蓝斑核与 α2A 肾上腺素受体",
    refs: [],
    abstract: {
      zh: "脑桥蓝斑核（LC）是全脑去甲肾上腺素觉醒中枢；突触后 α2A 受体激动剂（如胍法辛）可强化前额叶连接并平息 LC 过激放电。",
      en: "Locus Coeruleus and alpha-2A adrenoceptors: neural hub of noradrenergic arousal and target of guanfacine/clonidine.",
    },
    inArticle: {
      zh: "睡前服用小剂量胍法辛或可乐定可抑制夜间蓝斑核过度放电，消除睡前“脑内千军万马奔腾”的思维反刍。",
      en: "Bedtime guanfacine or clonidine suppresses nocturnal LC hyperarousal and racing thoughts without disrupting circadian phase.",
    },
  },
  {
    id: "rls-plmd",
    abbr: "RLS / PLMD",
    cn: "不安腿综合征与周期性肢体运动",
    refs: [
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/16218085/" },
    ],
    abstract: {
      zh: "以夜间双下肢不适感、强迫性活动欲及睡眠中周期性踢腿诱发微觉醒为特征的感觉运动障碍。",
      en: "Restless Legs Syndrome and Periodic Limb Movement Disorder: sensorimotor sleep disorders linked to central iron and dopamine deficiency.",
    },
    inArticle: {
      zh: "与 ADHD 共病率高达 25%–44%，核心机制在于血清铁蛋白（<30 μg/L）不足导致酪氨酸羟化酶合成多巴胺受阻。",
      en: "Comorbid in 25%–44% of ADHD patients, driven by low ferritin (<30 μg/L) impairing tyrosine hydroxylase dopamine synthesis.",
    },
  },
  {
    id: "glymphatic",
    abbr: "Glymphatic",
    cn: "脑类淋巴系统",
    refs: [
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/24136966/" },
    ],
    abstract: {
      zh: "依赖星形胶质细胞水通道蛋白 4（AQP4）、在慢波深度睡眠（N3）期间高速对流冲刷脑内代谢废物的清除系统。",
      en: "Glymphatic System: AQP4-mediated cerebrospinal fluid clearance pathway active primarily during N3 slow-wave sleep.",
    },
    inArticle: {
      zh: "慢性晚睡叠加闹钟早起剥夺了 N3 慢波睡眠，阻碍 β-淀粉样蛋白与 tau 蛋白清除，抬升远期认知衰退风险。",
      en: "Chronic N3 sleep curtailment in circadian ADHD impairs metabolic waste clearance and elevates long-term neurodegenerative risk.",
    },
  },
  {
    id: "feo-tre",
    abbr: "FEO / TRE",
    cn: "食物同步震荡器与限时进食",
    refs: [
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/31180809/" },
    ],
    abstract: {
      zh: "肝脏与胃肠道受进食时间调控的外周生物钟（FEO）；限时进食（TRE）通过将全天进食压缩在 8–10 小时内来同步外周代谢节律。",
      en: "Food-Entrainable Oscillator and Time-Restricted Eating: peripheral metabolic clocks entrained by meal timing.",
    },
    inArticle: {
      zh: "ADHD 患者深夜高糖夜宵会导致肝肠时钟与下丘脑主时钟解离；睡前 3–4 小时禁食有助于重建昼夜代谢振幅。",
      en: "Late-night snacking uncouples hepatic clocks from the SCN; an 8–10h daytime eating window restores metabolic rhythm amplitude.",
    },
  },
];
