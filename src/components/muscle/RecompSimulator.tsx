import { useState } from "react";

/**
 * 重组窗口模拟器：四个滑块 → 窗口判定
 * 阈值编码自文献：赤字 ≤20–25%（Longland/Murphy）、蛋白 1.6–2.4 g/kg/d（Morton/Helms）、
 * RT ≥3 次/周、睡眠 ≥7h（Nedeltcheva）；赤字 >40% 触发 mTOR refractory（Padilha）。
 * 示意模型，非个体医学预测。
 */

type Level = "good" | "warn" | "bad";

function levelOf(v: {
      deficit: number;
      protein: number;
      rt: number;
      sleep: number;
}) {
      const deficit: Level =
            v.deficit <= 25 ? "good" : v.deficit <= 40 ? "warn" : "bad";
      const protein: Level =
            v.protein >= 1.6 ? "good" : v.protein >= 1.2 ? "warn" : "bad";
      const rt: Level = v.rt >= 3 ? "good" : v.rt >= 1 ? "warn" : "bad";
      const sleep: Level =
            v.sleep >= 7 ? "good" : v.sleep >= 5.5 ? "warn" : "bad";
      return { deficit, protein, rt, sleep };
}

const LEVEL_STYLE: Record<Level, { bg: string; text: string; label: string }> =
      {
            good: { bg: "#57cc99", text: "#171412", label: "友好" },
            warn: { bg: "#ffd23f", text: "#171412", label: "警戒" },
            bad: { bg: "#ef476f", text: "#fff", label: "危险" },
      };

interface Row {
      key: "deficit" | "protein" | "rt" | "sleep";
      label: string;
      unit: string;
      min: number;
      max: number;
      step: number;
      hint: string;
}

const ROWS: Row[] = [
      {
            key: "deficit",
            label: "能量赤字",
            unit: "%",
            min: 0,
            max: 55,
            step: 5,
            hint: '文献甜点 ≤20–25%；>40% 时 mTOR 信号对蛋白补给"不应"',
      },
      {
            key: "protein",
            label: "蛋白质",
            unit: " g/kg/d",
            min: 0.8,
            max: 3.2,
            step: 0.1,
            hint: "赤字期推荐 1.6–2.4；<1.2 → 瘦体重净流失",
      },
      {
            key: "rt",
            label: "抗阻训练",
            unit: " 次/周",
            min: 0,
            max: 6,
            step: 1,
            hint: "≥3 次/周、多关节复合动作；仅有氧 → 瘦体重明显损失",
      },
      {
            key: "sleep",
            label: "睡眠",
            unit: " h/夜",
            min: 4,
            max: 10,
            step: 0.5,
            hint: "≤5.5 h：脂肪流失 -55%、瘦体重损失 +60%（Nedeltcheva 2010）",
      },
];

export default function RecompSimulator() {
      const [v, setV] = useState({
            deficit: 20,
            protein: 2.0,
            rt: 4,
            sleep: 7.5,
      });
      const levels = levelOf(v);

      const verdict =
            v.deficit > 40
                  ? {
                          bg: "#ef476f",
                          title: "窗口关闭：肌肉转入净流失",
                          body: "赤字 >40%：MPS 信号 refractory、皮质醇升高、瘦素下降。即便高蛋白+训练也难以净增肌——参考 Padilha 2017 (PMID:30242237)。",
                    }
                  : Object.values(levels).every((l) => l === "good")
                    ? {
                            bg: "#57cc99",
                            title: "重组窗口开启：可同时增肌减脂",
                            body: "条件组合符合 Longland 2016 高蛋白组范式：赤字下瘦体重 +1.2 kg、脂肪 -5.0 kg 的实测先例成立 (PMID:26817506)。",
                      }
                    : levels.protein === "bad" ||
                        levels.rt === "bad" ||
                        levels.sleep === "bad"
                      ? {
                              bg: "#ef476f",
                              title: "窗口漏风：瘦体重流失风险高",
                              body: "蛋白 <1.2 g/kg/d、缺抗阻训练或睡眠 ≤5.5 h 任一成立，赤字期的分解通路（FoxO→UPS/ALP）将占上风。先修补最差的变量。",
                        }
                      : {
                              bg: "#ffd23f",
                              title: '窗口半开：更可能是"保持"而非"增肌"',
                              body: '赤字温和但某些条件未拉满。~500 kcal/d 慢性赤字通常消除瘦体重增益但不削弱力量（Murphy & Koehler 2020, PMID:34623696）——"保持即胜利"。',
                        };

      return (
            <div>
                  {ROWS.map((row) => {
                        const lv = LEVEL_STYLE[levels[row.key]];
                        return (
                              <div
                                    key={row.key}
                                    style={{ marginBottom: "0.9rem" }}
                              >
                                    <div
                                          style={{
                                                display: "flex",
                                                alignItems: "baseline",
                                                gap: "0.6rem",
                                                fontFamily: "var(--font-mono)",
                                                fontSize: "0.78rem",
                                          }}
                                    >
                                          <strong
                                                style={{ minWidth: "5.5rem" }}
                                          >
                                                {row.label}
                                          </strong>
                                          <span
                                                style={{
                                                      fontWeight: 900,
                                                      fontSize: "0.95rem",
                                                }}
                                          >
                                                {v[row.key]}
                                                {row.unit}
                                          </span>
                                          <span
                                                style={{
                                                      background: lv.bg,
                                                      color: lv.text,
                                                      padding: "0 0.4rem",
                                                      border: "2px solid var(--ink)",
                                                }}
                                          >
                                                {lv.label}
                                          </span>
                                    </div>
                                    <input
                                          type="range"
                                          min={row.min}
                                          max={row.max}
                                          step={row.step}
                                          value={v[row.key]}
                                          onChange={(e) =>
                                                setV({
                                                      ...v,
                                                      [row.key]: Number(
                                                            e.target.value,
                                                      ),
                                                })
                                          }
                                          style={{
                                                width: "100%",
                                                accentColor: "var(--ink)",
                                          }}
                                          aria-label={row.label}
                                    />
                                    <div
                                          style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: "0.68rem",
                                                opacity: 0.65,
                                          }}
                                    >
                                          {row.hint}
                                    </div>
                              </div>
                        );
                  })}

                  <div
                        style={{
                              border: "var(--border)",
                              background: verdict.bg,
                              color:
                                    verdict.bg === "#ef476f"
                                          ? "#fff"
                                          : "#171412",
                              boxShadow: "var(--shadow-sm)",
                              padding: "0.7rem 0.9rem",
                              marginTop: "1rem",
                        }}
                  >
                        <strong
                              style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.85rem",
                              }}
                        >
                              {verdict.title}
                        </strong>
                        <p
                              style={{
                                    margin: "0.4rem 0 0",
                                    fontSize: "0.85rem",
                              }}
                        >
                              {verdict.body}
                        </p>
                  </div>
                  <p
                        style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.68rem",
                              opacity: 0.6,
                              marginTop: "0.6rem",
                        }}
                  >
                        * 基于文献群体阈值的示意模型，不构成个体医学/训练建议。
                  </p>
            </div>
      );
}
