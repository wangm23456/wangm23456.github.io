import { useEffect, useMemo, useState } from "react";

/**
 * 通用词条面板组件。
 *
 * 使用方传入 terms 与可选 category resolver，由本组件统一渲染：
 *   - 浮动按钮
 *   - 侧边抽屉（术语列表 + 详情）
 *   - 中英文切换
 *   - 自动按分类分组
 *
 * 渲染样式仍使用站内既有 CSS 变量，便于不同文章共享。
 */

export type Lang = "zh" | "en";

export type RefLink = {
  label: string;
  url: string;
};

export type Term = {
  id: string;
  abbr: string;
  cn: string;
  refs: RefLink[];
  abstract: {
    zh: string;
    en: string;
  };
  inArticle: {
    zh: string;
    en: string;
  };
};

export type CategoryResolver = (term: Term) => string;

export interface GlossaryPanelProps {
  terms: Term[];
  categoryResolver?: CategoryResolver;
  triggerLabel?: string;
  panelTitle?: string;
  buttonLabel?: string;
  abstractLabel?: { zh: string; en: string };
  inArticleLabel?: { zh: string; en: string };
}

const DEFAULT_CATEGORY_RESOLVER: CategoryResolver = (term) => {
  if (["mps", "mtorc1", "igf1", "p70s6k", "ampk", "leucine"].includes(term.id)) return "合成通路";
  if (["mpb", "foxo", "ups", "alp", "myostatin", "redd1", "autophagosome"].includes(term.id)) return "分解通路";
  if (["atgl", "cpt1", "ree", "mitochondrion"].includes(term.id)) return "代谢";
  if (["lea", "sarcopenia", "cachexia", "ahi", "kccq", "mash", "egfr", "mace"].includes(term.id)) return "临床 / 疾病";
  if (["ffa", "lsc", "ea", "es", "dxa", "mri", "girth", "strength_perf"].includes(term.id)) return "测量";
  if (["pax7", "rt", "myofiber"].includes(term.id)) return "训练";
  if (["hmb", "pre-rrna", "leptin", "cortisol", "glucocorticoid", "therm"].includes(term.id)) return "营养 / 激素";
  if (["rct", "meta", "pmc", "metabolic_adaptation", "estimand", "hr-ci"].includes(term.id)) return "方法学";
  return "其他";
};

export function buildCategoryGroups(terms: Term[], resolver: CategoryResolver): Record<string, Term[]> {
  const out: Record<string, Term[]> = {};
  for (const t of terms) {
    const cat = resolver(t);
    (out[cat] ||= []).push(t);
  }
  return out;
}

function Section({ title, body, accent }: { title: string; body: string; accent?: boolean }) {
  return <section style={{ margin: "0.9rem 0" }}>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem", color: accent ? "var(--brand)" : "var(--muted)" }}>{title}</div>
    <p style={{ margin: 0 }}>{body}</p>
  </section>;
}

export default function GlossaryPanel({
  terms = [],
  categoryResolver = DEFAULT_CATEGORY_RESOLVER,
  triggerLabel,
  panelTitle = "词条面板",
  buttonLabel = "词条",
  abstractLabel = { zh: "抽象含义", en: "Abstract" },
  inArticleLabel = { zh: "本文含义", en: "In this article" },
}: GlossaryPanelProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(terms[0]?.id ?? "");
  const [lang, setLang] = useState<Lang>("zh");

  const grouped = useMemo(() => buildCategoryGroups(terms, categoryResolver), [terms, categoryResolver]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const active = terms.find((t) => t.id === activeId);
  const finalLabel = triggerLabel ?? `${buttonLabel} (${terms.length})`;

  return <>
    <button type="button" onClick={() => setOpen(true)} aria-label={`打开${panelTitle}`} style={{ position: "fixed", right: "1.2rem", bottom: "1.2rem", zIndex: 50, padding: "0.55rem 0.9rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, background: "var(--ink)", color: "var(--paper)", border: "var(--border)", boxShadow: "var(--shadow)", cursor: "pointer" }}>{finalLabel}</button>
    {open && <>
      <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 60 }} />
      <aside role="dialog" aria-label={panelTitle} style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(560px, 100vw)", zIndex: 70, background: "var(--paper)", borderLeft: "var(--border)", boxShadow: "-5px 0 0 var(--ink)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 0.9rem", borderBottom: "var(--border)", background: "var(--paper-2)" }}>
          <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{panelTitle}</strong>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", opacity: 0.7 }}>{terms.length} 个术语</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.3rem" }}>
            <button type="button" onClick={() => setLang("zh")} aria-pressed={lang === "zh"} style={{ padding: "0.2rem 0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", background: lang === "zh" ? "var(--brand)" : "var(--card)", color: lang === "zh" ? "#fff" : "var(--ink)", border: "2px solid var(--ink)", cursor: "pointer" }}>中</button>
            <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"} style={{ padding: "0.2rem 0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", background: lang === "en" ? "var(--brand)" : "var(--card)", color: lang === "en" ? "#fff" : "var(--ink)", border: "2px solid var(--ink)", cursor: "pointer" }}>EN</button>
            <button type="button" onClick={() => setOpen(false)} aria-label="关闭" style={{ padding: "0.2rem 0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", background: "var(--card)", color: "var(--ink)", border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)", cursor: "pointer" }}>Close</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(120px, 38%) 1fr", flex: 1, minHeight: 0 }}>
          <nav aria-label="术语索引" style={{ borderRight: "var(--border-thin)", overflowY: "auto", background: "var(--paper-2)" }}>
            {Object.entries(grouped).map(([cat, items]) => <div key={cat}>
              <div style={{ padding: "0.5rem 0.8rem 0.3rem", fontFamily: "var(--font-mono)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>{cat}</div>
              {items.map((t) => <button key={t.id} type="button" onClick={() => setActiveId(t.id)} aria-current={t.id === activeId} style={{ display: "block", width: "100%", textAlign: "left", padding: "0.4rem 0.8rem", border: "none", borderTop: "1px solid var(--ink)", background: t.id === activeId ? "var(--yellow)" : "transparent", color: "var(--ink)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}><strong style={{ marginRight: "0.3rem" }}>{t.abbr}</strong><span style={{ opacity: 0.75, fontSize: "0.7rem" }}>{t.cn}</span></button>)}
            </div>)}
          </nav>
          <article style={{ overflowY: "auto", padding: "1rem 1.1rem 1.4rem", fontSize: "0.92rem", lineHeight: 1.65 }}>
            {active ? (
              <>
                <h3 style={{ margin: "0 0 0.2rem", fontFamily: "var(--font-mono)", fontSize: "1.1rem" }}>{active.abbr}</h3>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.9rem" }}>{active.cn}</div>
                <Section title={abstractLabel[lang]} body={active.abstract[lang]} />
                <Section title={inArticleLabel[lang]} body={active.inArticle[lang]} accent />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "1rem 0 0.4rem", color: "var(--muted)" }}>参考 / References</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {active.refs.map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "0.2rem 0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", background: "var(--card)", border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)", color: "var(--ink)", textDecoration: "none" }}>{r.label}</a></li>)}
                  </ul>
                </div>
              </>
            ) : <p>暂无词条</p>}
          </article>
        </div>
      </aside>
    </>}
  </>;
}
