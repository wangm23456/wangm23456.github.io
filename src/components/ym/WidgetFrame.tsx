import type { CSSProperties, ReactNode } from "react";

/** 站点统一的交互组件外壳：Hum 卡片纸（edge 细边 + card 底 + 柔影 + 圆角），mono 仅作数据标签。
 *  兼容层：子图表沿用旧变量名（--brand/--muted/--blue…），在此统一映射到新 token，
 *  明暗两模式经 tokens.css/dark.css 自动跟随；--brand 取站点红，--blue 取 accent-2。 */
export const ymAlias = {
  "--ink": "var(--color-ink)",
  "--muted": "var(--color-ink-2)",
  "--card": "var(--color-card)",
  "--paper-2": "var(--color-paper-2)",
  "--blue": "var(--color-accent-2)",
  "--brand": "var(--color-error)",
  "--border": "1px solid var(--color-edge)",
  "--border-thin": "1px solid var(--color-rule)",
  "--shadow": "var(--shadow-card)",
  "--font-mono": "var(--font-outlier)",
} as CSSProperties;

export function ChartViewport({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ containerType: "inline-size" }}>
      <p className="ym-chart-hint">左右滑动查看完整图表</p>
      <div className="ym-chart-viewport" role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}

export default function WidgetFrame({
  code,
  title,
  caption,
  children,
  note,
}: {
  code: string;
  title: string;
  caption: string;
  children: ReactNode;
  note?: ReactNode;
}) {
  const shell: CSSProperties = {
    ...ymAlias,
    border: "1px solid var(--color-edge)",
    borderRadius: "var(--radius-card)",
    boxShadow: "var(--shadow-card)",
    background: "var(--color-card)",
    padding: "1.4rem 1.5rem 1.6rem",
    margin: "2.2rem 0",
  };
  const head: CSSProperties = {
    fontFamily: "var(--font-outlier)",
    fontSize: "0.8125rem",
    color: "var(--color-accent-2)",
    fontWeight: 600,
  };
  const cap: CSSProperties = {
    color: "var(--color-ink-2)",
    fontSize: "0.875rem",
    margin: "0.35rem 0 1rem",
  };
  const noteStyle: CSSProperties = {
    borderTop: "2px dashed var(--color-rule)",
    paddingTop: "0.8rem",
    marginTop: "1rem",
    fontSize: "0.875rem",
    color: "var(--color-ink-2)",
  };
  return (
    <section style={shell}>
      <div style={head}>
        ▚ {code} · {title}
      </div>
      <p style={cap}>{caption}</p>
      {children}
      {note && <div style={noteStyle}>{note}</div>}
    </section>
  );
}
