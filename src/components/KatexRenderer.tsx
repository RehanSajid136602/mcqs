"use client";
import { useMemo } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface KatexRendererProps {
  text: string;
}

export default function KatexRenderer({ text }: KatexRendererProps) {
  const segments = useMemo(() => {
    const parts: Array<{ type: "text" | "math"; value: string }> = [];
    const regex = /\$([^$]+)\$/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: "math", value: match[1] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", value: text.slice(lastIndex) });
    }

    return parts;
  }, [text]);

  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "math" ? (
          <InlineMath key={i} math={seg.value} />
        ) : (
          <span key={i}>{seg.value}</span>
        )
      )}
    </>
  );
}