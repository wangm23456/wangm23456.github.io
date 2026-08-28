import { useState } from "react";

/**
 * 肌肉蛋白平衡通路图：合成侧（mTORC1 轴）vs 分解侧（FoxO 轴）
 * 三种生理状态切换：进食/合成 · 温和赤字（重组窗口）· 严重赤字（窗口关闭）
 * 节点可点击查看机制说明与文献
 */

type Mode = "fed" | "deficit" | "severe";
type NodeState = "on" | "dim" | "refractory" | "danger";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  side: "ana" | "cat" | "cross";
  states: Record<Mode, NodeState>;
  desc: string;
  refs: { label: string; url: string }[];
}

const P = "https://pubmed.ncbi.nlm.nih.gov/";

const NODES: Node[] = [
  {
    id: "rt",
    label: "抗阻训练 / 机械张力",
    x: 24,
    y: 24,
    w: 150,
    h: 40,
    side: "ana",
    states: { fed: "on", deficit: "on", severe: "on" },
    desc: "机械张力经 ECM→integrin→FAK 使 mTORC1 向肌膜下易位并激活（Akt 非依赖通路）。抗阻训练是赤字期保留瘦体重的最强干预：Meta 显示 CR+RT 几乎可完全预防瘦体重损失。",
    refs: [
      {
        label: "PMC3099033",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3099033/",
      },
      {
        label: "PMC5946208",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5946208/",
      },
    ],
  },
  {
    id: "leu",
    label: "亮氨酸 / EAA",
    x: 24,
    y: 84,
    w: 150,
    h: 40,
    side: "ana",
    states: { fed: "on", deficit: "on", severe: "dim" },
    desc: '亮氨酸经 Rag GTPase 把 mTORC1 募集至溶酶体表面激活翻译起始。单餐 MPS 平台约 20–40 g 优质蛋白；亮氨酸是"触发"信号，充足蛋白下额外补充无独立增益。',
    refs: [
      { label: "PMID:19056590", url: P + "19056590/" },
      { label: "PMID:32079916", url: P + "32079916/" },
    ],
  },
  {
    id: "igf",
    label: "IGF-1 / 胰岛素",
    x: 24,
    y: 144,
    w: 150,
    h: 40,
    side: "ana",
    states: { fed: "on", deficit: "dim", severe: "dim" },
    desc: "IGF-1→PI3K→Akt→TSC1/2→Rheb 激活 mTORC1，同时磷酸化 FoxO 使其出核失活——Akt 是连接合成与分解两侧的总阀门。赤字/饥饿时该信号减弱，FoxO 脱抑制。",
    refs: [{ label: "PMID:15125842", url: P + "15125842/" }],
  },
  {
    id: "ampk",
    label: "AMPK（能量应激/耐力）",
    x: 236,
    y: 12,
    w: 176,
    h: 36,
    side: "cross",
    states: { fed: "dim", deficit: "on", severe: "danger" },
    desc: "AMPK 感知能量应激：磷酸化 TSC2/Raptor 抑制 mTORC1（同期训练干扰效应的分子基础），同时磷酸化 FoxO3 促进分解。耐力运动先抗阻后做、间隔 6–24 h 可缓解干扰。",
    refs: [{ label: "PMID:22002517", url: P + "22002517/" }],
  },
  {
    id: "mtorc1",
    label: "mTORC1",
    x: 232,
    y: 84,
    w: 104,
    h: 46,
    side: "ana",
    states: { fed: "on", deficit: "on", severe: "refractory" },
    desc: '合成总枢纽：下游 p70S6K 与 4E-BP1 磷酸化驱动翻译起始。rapamycin 人体试验证明其对收缩诱导 MPS 不可替代。严重赤字（>40%）时 mTOR-S6K1 对蛋白补给呈"不应"（refractory）——重组窗口关闭的核心机制。',
    refs: [
      {
        label: "PMC2678224",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2678224/",
      },
      { label: "PMID:30242237", url: P + "30242237/" },
    ],
  },
  {
    id: "ribo",
    label: "核糖体生物合成",
    x: 232,
    y: 144,
    w: 150,
    h: 36,
    side: "ana",
    states: { fed: "on", deficit: "on", severe: "dim" },
    desc: 'c-Myc→Pol I 驱动 45S pre-rRNA 扩增，提升翻译能力。早期核糖体 RNA 增幅预测长期肥大量级，是"高响应者"与"低响应者"差异的核心候选机制。',
    refs: [
      {
        label: "PMC4732984",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4732984/",
      },
    ],
  },
  {
    id: "mps",
    label: "MPS ↑",
    x: 420,
    y: 84,
    w: 96,
    h: 46,
    side: "ana",
    states: { fed: "on", deficit: "on", severe: "dim" },
    desc: "肌肉蛋白合成速率。抗阻训练后升高维持 24–48 h；40–55% 能量赤字使餐后 MPS 钝化 20–50%。赤字期肌肉流失的主因是合成侧抑制，而非分解侧升高。",
    refs: [
      { label: "PMID:25644344", url: P + "25644344/" },
      { label: "PMID:28899879", url: P + "28899879/" },
    ],
  },
  {
    id: "hyper",
    label: "肌肉肥大",
    x: 560,
    y: 84,
    w: 116,
    h: 46,
    side: "ana",
    states: { fed: "on", deficit: "on", severe: "dim" },
    desc: "净蛋白平衡为正的长期累积结果。训练剂量学：每周组数线性正相关（受训者 18–27 组趋顶）；负荷高低对肥大无差异（控制力竭度后）；蛋白 ~1.62 g/kg/d 进入平台。",
    refs: [
      { label: "PMID:27433992", url: P + "27433992/" },
      {
        label: "PMC5867436",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5867436/",
      },
    ],
  },
  {
    id: "deficit",
    label: "能量赤字",
    x: 24,
    y: 268,
    w: 150,
    h: 40,
    side: "cat",
    states: { fed: "dim", deficit: "on", severe: "danger" },
    desc: "减脂的唯一驱动，但同时抑制 MPS 并减弱胰岛素/IGF-1。无防护减重时瘦体重损失占总减重 15–35%；≤20–25% 温和赤字 + 高蛋白 + RT 可使净平衡保持为正。",
    refs: [{ label: "PMID:26817506", url: P + "26817506/" }],
  },
  {
    id: "unload",
    label: "力学卸载 / 废用",
    x: 24,
    y: 328,
    w: 150,
    h: 40,
    side: "cat",
    states: { fed: "dim", deficit: "dim", severe: "dim" },
    desc: "卧床/制动/失重 → Akt↓ → FoxO 脱抑制（48–72 h 达峰）。短期废用性肌肉流失几乎全部来自 MPS 下降；复训后较易逆转。",
    refs: [
      {
        label: "PMC9397550",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9397550/",
      },
    ],
  },
  {
    id: "inflam",
    label: "炎症 TNF-α / IL-6",
    x: 24,
    y: 388,
    w: 150,
    h: 40,
    side: "cat",
    states: { fed: "dim", deficit: "dim", severe: "dim" },
    desc: "TNF-α→NF-κB 与 IL-6→JAK/STAT3 是恶病质（cachexia）的核心驱动；IKKβ 转基因即可诱发严重肌肉消耗。慢性低度炎症也参与肌少症的合成代谢抵抗。",
    refs: [
      { label: "PMID:15479644", url: P + "15479644/" },
      {
        label: "PMC4409274",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4409274/",
      },
    ],
  },
  {
    id: "gc",
    label: "糖皮质激素",
    x: 196,
    y: 388,
    w: 130,
    h: 40,
    side: "cat",
    states: { fed: "dim", deficit: "dim", severe: "danger" },
    desc: "皮质醇经 GR→KLF15 + REDD1 双靶点：REDD1 抑制 mTORC1，KLF15 协同 FoxO 上调 atrogene。REDD1 敲除完全预防激素性萎缩——长期大赤字（皮质醇升高）绕过了营养/训练能修复的通路。",
    refs: [{ label: "PMID:25315696", url: P + "25315696/" }],
  },
  {
    id: "foxo",
    label: "FoxO",
    x: 220,
    y: 296,
    w: 96,
    h: 46,
    side: "cat",
    states: { fed: "dim", deficit: "on", severe: "danger" },
    desc: "分解总开关。Akt 磷酸化 FoxO 使其出核失活；IGF-1/Akt 信号下降时 FoxO3 入核，同时启动泛素-蛋白酶体与自噬两条降解通路的基因程序。",
    refs: [
      { label: "PMID:18054316", url: P + "18054316/" },
      { label: "PMID:14769813", url: P + "14769813/" },
    ],
  },
  {
    id: "ups",
    label: "UPS: MuRF1/MAFbx",
    x: 386,
    y: 268,
    w: 160,
    h: 40,
    side: "cat",
    states: { fed: "dim", deficit: "on", severe: "danger" },
    desc: "泛素-蛋白酶体系统：MuRF1 泛素化肌球蛋白重链等粗肌丝组分，MAFbx 降解 eIF3f/MyoD。2001 年在 11 种萎缩模型中共同发现，是肌肉萎缩的分子标志物。",
    refs: [{ label: "PMID:11679633", url: P + "11679633/" }],
  },
  {
    id: "alp",
    label: "ALP 自噬-溶酶体",
    x: 386,
    y: 328,
    w: 160,
    h: 40,
    side: "cat",
    states: { fed: "dim", deficit: "on", severe: "danger" },
    desc: "LC3/Bnip3/Cathepsin L 介导的自噬-溶酶体通路。基础自噬是肌稳态必需（Atg5/7 缺陷鼠自发性萎缩），过度激活则驱动萎缩——双向作用。",
    refs: [{ label: "PMID:19945408", url: P + "19945408/" }],
  },
  {
    id: "mpb",
    label: "MPB ↑",
    x: 580,
    y: 296,
    w: 96,
    h: 46,
    side: "cat",
    states: { fed: "dim", deficit: "on", severe: "danger" },
    desc: "肌肉蛋白分解速率。严格饥饿时上升约 25–40%；但温和赤字+抗阻训练个体中 atrogene 上调被抑制。流失 = MPS↓ 与 MPB↑ 的叠加。",
    refs: [{ label: "PMID:24011660", url: P + "24011660/" }],
  },
];

const EDGES: { from: string; to: string; inhibit?: boolean }[] = [
  { from: "rt", to: "mtorc1" },
  { from: "leu", to: "mtorc1" },
  { from: "igf", to: "mtorc1" },
  { from: "ampk", to: "mtorc1", inhibit: true },
  { from: "ribo", to: "mps" },
  { from: "mtorc1", to: "mps" },
  { from: "mps", to: "hyper" },
  { from: "deficit", to: "foxo" },
  { from: "unload", to: "foxo" },
  { from: "inflam", to: "foxo" },
  { from: "gc", to: "foxo" },
  { from: "foxo", to: "ups" },
  { from: "foxo", to: "alp" },
  { from: "ups", to: "mpb" },
  { from: "alp", to: "mpb" },
];

const MODES: { id: Mode; label: string; hint: string }[] = [
  {
    id: "fed",
    label: "进食 / 合成状态",
    hint: "mTORC1 全开，FoxO 被 Akt 压制——净合成。",
  },
  {
    id: "deficit",
    label: "温和赤字 ≤25%（重组窗口）",
    hint: "训练+高蛋白顶住 mTORC1，FoxO 部分激活——增肌减脂可同时发生。",
  },
  {
    id: "severe",
    label: "严重赤字 >40%（窗口关闭）",
    hint: 'mTORC1 对蛋白补给"不应"，糖皮质激素轴加入——肌肉转入净流失。',
  },
];

const FILL: Record<NodeState, string> = {
  on: "#57cc99",
  dim: "var(--paper-2)",
  refractory: "#9a938a",
  danger: "#ef476f",
};

function center(n: Node) {
  return {
    cx: n.x + n.w / 2,
    cy: n.y + n.h / 2,
    right: n.x + n.w,
    left: n.x,
    top: n.y,
    bottom: n.y + n.h,
  };
}

export default function PathwayMap() {
  const [mode, setMode] = useState<Mode>("deficit");
  const [selected, setSelected] = useState<Node | null>(null);
  const byId: Record<string, Node> = Object.fromEntries(
    NODES.map((n) => [n.id, n]),
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "0.8rem",
        }}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          margin: "0 0 0.8rem",
        }}
      >
        {MODES.find((m) => m.id === mode)!.hint}
      </p>

      <svg
        viewBox="0 0 700 452"
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label="肌肉蛋白平衡信号通路图"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink)" />
          </marker>
        </defs>

        {EDGES.map((e) => {
          const a = center(byId[e.from]);
          const b = center(byId[e.to]);
          const goingUp = b.cy < a.cy - 10;
          const goingDown = b.cy > a.cy + 10;
          // 从侧边中点出发，到目标左侧/右侧中点
          const x1 = a.right < b.left ? a.right : a.cx;
          const y1 =
            a.right < b.left
              ? a.cy
              : goingUp
                ? a.top
                : goingDown
                  ? a.bottom
                  : a.cy;
          const x2 = b.left > a.right ? b.left : b.cx;
          const y2 = b.left > a.right ? b.cy : b.cy;
          const active =
            byId[e.from].states[mode] !== "dim" &&
            byId[e.to].states[mode] !== "dim";
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={x1}
              y1={y1}
              x2={x2 - (e.inhibit ? 2 : 6)}
              y2={y2}
              stroke={e.inhibit ? "#ef476f" : "var(--ink)"}
              strokeWidth={e.inhibit ? 3 : 2}
              strokeDasharray={e.inhibit ? "5 4" : undefined}
              markerEnd={e.inhibit ? undefined : "url(#arrow)"}
              opacity={active ? 1 : 0.25}
            />
          );
        })}
        {/* AMPK 抑制 mTORC1 的平头符号 */}
        <line
          x1={232}
          y1={66}
          x2={336}
          y2={66}
          stroke="#ef476f"
          strokeWidth="3"
          opacity={mode === "fed" ? 0.25 : 1}
        />

        {NODES.map((n) => {
          const st = n.states[mode];
          return (
            <g
              key={n.id}
              onClick={() => setSelected(n)}
              style={{ cursor: "pointer" }}
              opacity={st === "dim" ? 0.45 : 1}
            >
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                fill={FILL[st]}
                stroke="var(--ink)"
                strokeWidth={selected?.id === n.id ? 4 : 2.5}
              />
              {st === "refractory" && (
                <text
                  x={n.x + n.w / 2}
                  y={n.y + n.h / 2 - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fontWeight="700"
                >
                  REFRACTORY
                </text>
              )}
              <text
                x={n.x + n.w / 2}
                y={n.y + n.h / 2 + (st === "refractory" ? 10 : 4)}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="700"
                fontFamily="var(--font-mono)"
                fill={
                  st === "on" || st === "danger" || st === "refractory"
                    ? "#171412"
                    : "var(--ink)"
                }
              >
                {n.label}
              </text>
            </g>
          );
        })}

        <text
          x="24"
          y="224"
          fontSize="12"
          fontWeight="900"
          fontFamily="var(--font-mono)"
          fill="#2a7a4f"
        >
          合成侧 ANABOLIC
        </text>
        <text
          x="24"
          y="252"
          fontSize="12"
          fontWeight="900"
          fontFamily="var(--font-mono)"
          fill="#b03050"
        >
          分解侧 CATABOLIC
        </text>
      </svg>

      {selected && (
        <div
          style={{
            border: "var(--border-thin)",
            background: "var(--paper-2)",
            padding: "0.7rem 0.9rem",
            marginTop: "0.8rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <strong>{selected.label}</strong>
            <button type="button" onClick={() => setSelected(null)}>
              关闭 ✕
            </button>
          </div>
          <p style={{ fontSize: "0.88rem", margin: "0.5rem 0" }}>
            {selected.desc}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              margin: 0,
            }}
          >
            文献：
            {selected.refs.map((r) => (
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
      {!selected && (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            margin: "0.6rem 0 0",
            opacity: 0.7,
          }}
        >
          ▲ 点击任意节点查看机制与文献
        </p>
      )}
    </div>
  );
}
