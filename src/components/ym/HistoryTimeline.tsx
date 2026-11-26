import { useState } from "react";
import { ymAlias } from "./WidgetFrame";

type Event = { year: string; title: string; note: string; key?: boolean };

const EVENTS: Event[] = [
  {
    year: "1954",
    title: "杨振宁 & Mills：局域规范对称",
    note: "把电磁学的整体相位对称升级为「每个点各转各的」：补偿场即规范玻色子。本想描述强相互作用，但无质量玻色子与实验矛盾；Pauli 当场质问「质量项从哪来」。出路有二：Higgs 机制（弱力）与渐近自由（强力）。后者意味着质量间隙必须由理论自己动力学产生，千禧年问题问的正是这件事。",
    key: true,
  },
  {
    year: "1973",
    title: "渐近自由：Gross、Wilczek、Politzer",
    note: "非阿贝尔规范理论的 β 函数为负：短距离变弱、长距离变强。解释了深度非弹性散射（2004 年诺奖），也告诉数学家：连续统极限「住」在弱耦合端，但要到达那里，必须穿越无穷长的强耦合路径。",
    key: true,
  },
  {
    year: "1974",
    title: "Wilson 格点：把场论变成统计力学",
    note: "时空离散化，规范对称从无穷维鬼魂变成有限维积分里的良好结构。强耦合下证明面积定律，即夸克禁闭的数学表述。这是一切严格工作（Balaban、Chatterjee、2026 年 AI 证明）的共同起点。",
    key: true,
  },
  {
    year: "2000",
    title: "Clay 千禧年问题设立（Jaffe & Witten 题面）",
    note: "任何紧致单群 G 上，四维量子杨–米尔斯理论存在且质量间隙 Δ > 0。脚注 2 明文排除「弱存在性」捷径；质量间隙被绑进存在性论证：有限体积一致谱隙是通往无穷体积极限的工具性前提。100 万美元。",
    key: true,
  },
  {
    year: "2024",
    title: "概率论路线的里程碑：3D YM–Higgs",
    note: "Chandra–Chevyrev–Hairer–Shen 在 Inventiones 上完成三维 YM–Higgs 的严格随机量子化构造。奇异 SPDE 工具（Hairer 正则结构，2014 年菲尔兹奖）第一次真正触碰规范场。",
  },
  {
    year: "2026.01",
    title: "Douglas 千禧年综述（Nature Reviews Physics）",
    note: "问题设立 25 周年盘点。六条 Key Points 里最扎眼的一条：质量间隙「no clear path is known」（尚无明确证明路径）。十个月后，本文作者本人成了 AI 证明主张的五人验证委员会成员。",
  },
  {
    year: "2026.10",
    title: "OpenAI 主张存在性证明",
    note: "10 月 26 日，OpenAI 宣布内部模型产出含费米子四维规范场论的存在性证明（1147 页 + 声称完成的 Lean 形式化），纯 YM 为子问题，质量间隙未触及。数学/CS 结果当日开源；物理结果交五人委员会「监护」，一字未公开。AGMAI 同日发文：Lean 已完成，再没有科学理由押后。",
    key: true,
  },
];

export default function HistoryTimeline() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-label="历史时间线" style={{ ...ymAlias, margin: "1.8rem 0" }}>
      {EVENTS.map((e, i) => {
        const isOpen = open === i;
        return (
          <div
            key={e.year}
            onClick={() => setOpen(isOpen ? null : i)}
            style={{
              cursor: "pointer",
              marginLeft: "4.2rem",
              paddingLeft: "1rem",
              borderLeft: `2px solid ${e.key ? "var(--brand)" : "var(--muted)"}`,
              padding: "0.6rem 0 0.6rem 1rem",
              position: "relative",
              background: isOpen ? "var(--paper-2)" : "transparent",
              transition: "background 0.15s",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "-4.7rem",
                top: "0.7rem",
                width: "3.9rem",
                whiteSpace: "nowrap",
                textAlign: "right",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "var(--brand)",
              }}
            >
              {e.year}
            </span>
            <span
              style={{
                position: "absolute",
                left: "-7px",
                top: "0.95rem",
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                background: e.key ? "var(--brand)" : "var(--card)",
                border: "2px solid var(--brand)",
              }}
            />
            <div style={{ fontWeight: 700, fontSize: "0.98rem" }}>
              {e.title}
            </div>
            <div
              style={{
                maxHeight: isOpen ? "320px" : 0,
                overflow: "hidden",
                transition: "max-height 0.3s ease",
                fontSize: "0.86rem",
                color: "var(--muted)",
                marginTop: isOpen ? "0.4rem" : 0,
                lineHeight: 1.8,
              }}
            >
              ▸ {e.note}
            </div>
          </div>
        );
      })}
    </section>
  );
}
