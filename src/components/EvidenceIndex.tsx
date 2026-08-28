import { useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * 通用证据索引组件。
 *
 * 使用方传入 sources 与 claims，由本组件统一渲染：
 *   - 浮动按钮（标题与计数由 props 控制）
 *   - 侧边抽屉
 *   - 两个 tab：结论 → 来源 / references（反向）
 *   - 每个结论条目支持正文编号 [E编号] 反向跳转
 *   - 每条 references 显示支持该来源的正文结论
 *
 * 渲染样式仍使用站内既有 CSS 变量，便于不同文章共享。
 */

export type EvidenceLevel = "A" | "B" | "C" | "D" | "E";

export type EvidenceSource = {
  id: string;
  label: string;
  detail: string;
  level: EvidenceLevel;
  url?: string;
};

export type EvidenceClaim = {
  id: string;
  section: string;
  text: string;
  result: string;
  basis: string;
  level: EvidenceLevel;
  sourceIds: string[];
};

export const EVIDENCE_LEVEL_LABEL: Record<EvidenceLevel, string> = {
  A: "A｜随机试验",
  B: "B｜补充证据",
  C: "C｜观察数据",
  D: "D｜机制推断",
  E: "E｜监管/注册",
};

interface EvidencePanelProps {
  sources: EvidenceSource[];
  claims: EvidenceClaim[];
  triggerLabel?: string;
  panelTitle?: string;
  claimsTabLabel?: string;
  referencesTabLabel?: string;
  searchPlaceholder?: string;
  resultLabel?: string;
  interpretationLabel?: string;
  referencesHeading?: string;
  backToArticleLabel?: string;
  primarySourceLabel?: string;
}

export function EvidenceLink({ claimId, children }: { claimId: string; children: ReactNode }) {
  return <span id={`claim-body-${claimId}`}><a href={`#evidence-claim-${claimId}`} style={{ marginLeft: "0.18em", color: "var(--brand)", textDecoration: "underline", textDecorationThickness: "2px", textUnderlineOffset: "3px", whiteSpace: "nowrap" }}>{children}</a></span>;
}

export default function EvidencePanel({
  sources,
  claims,
  triggerLabel = "证据",
  panelTitle = "证据",
  claimsTabLabel = "证据",
  referencesTabLabel = "references",
  searchPlaceholder = "搜索结论、试验或来源…",
  resultLabel = "摘要 / 结果转译",
  interpretationLabel = "证据解读",
  referencesHeading = "原始来源索引",
  backToArticleLabel = "返回正文",
  primarySourceLabel = "原始来源",
}: EvidencePanelProps) {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<"claims" | "sources">("claims");
  const [activeId, setActiveId] = useState(claims[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const filteredClaims = useMemo(() => claims.filter((claim) => `${claim.text} ${claim.section} ${claim.basis}`.toLowerCase().includes(query.toLowerCase())), [query, claims]);
  const claimsBySource = useMemo(() => new Map(sources.map((source) => [source.id, claims.filter((claim) => claim.sourceIds.includes(source.id))])), [sources, claims]);
  const activeClaim = claims.find((claim) => claim.id === activeId) ?? claims[0];
  const sourceClaimMap = claimsBySource;

  useEffect(() => {
    const openFromHash = () => {
      const claimId = window.location.hash.replace("#evidence-claim-", "");
      if (!claims.some((claim) => claim.id === claimId)) return;
      setDirection("claims");
      setActiveId(claimId);
      setOpen(true);
      requestAnimationFrame(() => document.getElementById(`evidence-claim-${claimId}`)?.scrollIntoView({ block: "center" }));
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [claims]);

  return <>
    <button type="button" onClick={() => setOpen(true)} aria-label={`打开${panelTitle}`} style={{ position: "fixed", right: "1.2rem", bottom: "4.3rem", zIndex: 50, padding: "0.55rem 0.9rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, background: "var(--brand)", color: "#fff", border: "var(--border)", boxShadow: "var(--shadow)", cursor: "pointer" }}>{triggerLabel} ({claims.length})</button>
    {open && <>
      <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 60 }} />
      <aside role="dialog" aria-label={panelTitle} style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(700px, 100vw)", zIndex: 70, background: "var(--paper)", borderLeft: "var(--border)", boxShadow: "-5px 0 0 var(--ink)", display: "flex", flexDirection: "column" }}>
        <header style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 0.9rem", borderBottom: "var(--border)", background: "var(--paper-2)" }}>
          <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "0.05em" }}>{panelTitle}</strong>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", opacity: 0.7 }}>{claims.length} 条结论 · {sources.length} 个来源</span>
          <button type="button" onClick={() => setOpen(false)} aria-label={`关闭${panelTitle}`} style={{ marginLeft: "auto", padding: "0.2rem 0.6rem", fontFamily: "var(--font-mono)", background: "var(--card)", color: "var(--ink)", border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)", cursor: "pointer" }}>Close</button>
        </header>
        <div style={{ padding: "0.7rem 0.9rem", borderBottom: "var(--border)", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <button type="button" onClick={() => setDirection("claims")} aria-pressed={direction === "claims"} style={{ padding: "0.35rem 0.55rem", border: "2px solid var(--ink)", background: direction === "claims" ? "var(--yellow)" : "var(--card)", color: "var(--ink)", fontFamily: "var(--font-mono)", cursor: "pointer" }}>{claimsTabLabel}</button>
          <button type="button" onClick={() => setDirection("sources")} aria-pressed={direction === "sources"} style={{ padding: "0.35rem 0.55rem", border: "2px solid var(--ink)", background: direction === "sources" ? "var(--yellow)" : "var(--card)", color: "var(--ink)", fontFamily: "var(--font-mono)", cursor: "pointer" }}>{referencesTabLabel}</button>
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={`搜索${panelTitle}`} placeholder={searchPlaceholder} style={{ flex: "1 1 220px", minHeight: "2.3rem", padding: "0.45rem 0.6rem", border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)" }} />
        </div>
        <div style={{ overflowY: "auto", padding: "0.85rem" }}>
          {direction === "claims" && <>
            {filteredClaims.map((claim) => <article id={`evidence-claim-${claim.id}`} key={claim.id} style={{ scrollMarginTop: "1rem", marginBottom: "0.75rem", padding: "0.8rem", border: claim.id === activeClaim.id ? "2px solid var(--brand)" : "1px solid var(--line)", background: "var(--paper-2)" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5 }}>{claim.text}</h3>
              <p style={{ margin: "0.45rem 0", fontSize: "0.82rem", lineHeight: 1.55 }}><strong>{resultLabel}：</strong>{claim.result}</p>
              <p style={{ margin: "0.45rem 0", fontSize: "0.82rem", lineHeight: 1.55 }}><strong>{interpretationLabel}：</strong>{claim.basis}</p>
              <div style={{ marginBottom: "0.45rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>{claim.section} · {EVIDENCE_LEVEL_LABEL[claim.level]}</div>
              <div style={{ fontSize: "0.78rem" }}><strong>来源：</strong>{claim.sourceIds.map((sourceId, index) => { const source = sources.find((item) => item.id === sourceId)!; return <span key={source.id}>{index > 0 && "；"}<a href={`#evidence-source-${source.id}`}>{source.label}</a>{source.url && <> · <a href={source.url} target="_blank" rel="noopener noreferrer">{primarySourceLabel}</a></>}</span>; })}</div>
              <a href={`#claim-body-${claim.id}`} onClick={() => setOpen(false)} style={{ display: "inline-block", marginTop: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>{backToArticleLabel}</a>
            </article>)}
            {filteredClaims.length === 0 && <p>没有匹配结论。</p>}
          </>}
          {direction === "sources" && <>
            {filteredClaims.length === 0 && claims.length === 0 && <p>暂无结论数据。</p>}
            {sources.filter((source) => `${source.label} ${source.detail}`.toLowerCase().includes(query.toLowerCase())).map((source) => <article id={`evidence-source-${source.id}`} key={source.id} style={{ scrollMarginTop: "1rem", marginBottom: "0.55rem", padding: "0.65rem 0.75rem", borderLeft: "3px solid var(--brand)", background: "var(--paper-2)" }}>
              <strong>{source.label}</strong><span style={{ display: "block", fontSize: "0.78rem", color: "var(--muted)" }}>{source.detail} · {EVIDENCE_LEVEL_LABEL[source.level]}</span>
              <span style={{ display: "block", marginTop: "0.25rem", fontSize: "0.76rem" }}>支持：{(sourceClaimMap.get(source.id) ?? []).map((claim, index) => <span key={claim.id}>{index > 0 && "、"}<a href={`#evidence-claim-${claim.id}`}>{claim.section}结论</a></span>)}</span>
              {source.url && <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "0.25rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>{primarySourceLabel}</a>}
            </article>)}
          </>}
        </div>
      </aside>
    </>}
  </>;
}
