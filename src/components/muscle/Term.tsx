import { useId } from "react";

// BaseLayout owns term interactions for both server-rendered and hydrated markup.

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

export default function Term({ children, tip, cn }: Props) {
    const id = useId();

    return (
        <dfn className="term">
            <button type="button" className="term__trigger" aria-expanded={false} aria-describedby={id}>
                {children}
            </button>
            <span id={id} className="term__tip" role="tooltip">
                {cn && <span className="term__cn">{cn}</span>}
                <span className="term__body">{tip}</span>
            </span>
        </dfn>
    );
}
