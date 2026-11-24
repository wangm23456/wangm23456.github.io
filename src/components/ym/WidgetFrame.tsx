import type { CSSProperties, ReactNode } from "react";

/** 站点统一的交互组件外壳：粗边框 + 硬阴影 + mono 标签，全部走 global.css 变量以适配暗色。 */
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
    border: "var(--border)",
    boxShadow: "var(--shadow)",
    background: "var(--card)",
    padding: "1.4rem 1.5rem 1.6rem",
    margin: "2.2rem 0",
  };
  const head: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    letterSpacing: "0.2em",
    color: "var(--brand)",
    fontWeight: 700,
  };
  const cap: CSSProperties = {
    color: "var(--muted)",
    fontSize: "0.85rem",
    margin: "0.35rem 0 1rem",
  };
  const noteStyle: CSSProperties = {
    borderTop: "2px dashed var(--ink)",
    paddingTop: "0.8rem",
    marginTop: "1rem",
    fontSize: "0.86rem",
    color: "var(--muted)",
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
