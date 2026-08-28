import { useId, useState } from "react";

/**
 * 行内术语标记：粗野主义样式的 hover/focus 气泡
 *
 * 用法：
 *   <Term tip="把氨基酸拼成新肌蛋白">MPS</Term>
 *
 * - 屏幕阅读器：渲染为 <dfn>（definition term），符合语义
 * - 鼠标：hover 出气泡
 * - 触屏：tap 进 / 出气泡（focus 状态）
 * - 键盘：Tab 到该术语，Enter / Space 出气泡
 *
 * 不在 .mdx 中写括号注音，改用这个组件包裹首次术语即可。
 */

interface Props {
    /** 术语本身，会显示为粗体 + 虚线下划线 */
    children: React.ReactNode;
    /** 气泡里的简短解释 */
    tip: string;
    /** 可选：术语的中文全称，作为气泡首行 */
    cn?: string;
    /** 强制中英文版本 */
    lang?: "zh" | "en";
}

export default function Term({ children, tip, cn, lang }: Props) {
    const [open, setOpen] = useState(false);
    const id = useId();

    return (
        <dfn
            className="term"
            onClick={() => setOpen((v) => !v)}
            onBlur={() => setOpen(false)}
            tabIndex={0}
            role="button"
            aria-expanded={open}
            aria-describedby={id}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen((v) => !v);
                }
                if (e.key === "Escape") setOpen(false);
            }}
        >
            {children}
            <span
                id={id}
                className={`term__tip ${open ? "term__tip--show" : ""}`}
                role="tooltip"
            >
                {cn && <span className="term__cn">{cn}</span>}
                <span className="term__body">{tip}</span>
            </span>
        </dfn>
    );
}
