"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import katex from "katex";

interface KatexRendererProps {
  text: string;
  displayMode?: boolean;
}

function renderMath(expr: string, display: boolean): string {
  try {
    return katex.renderToString(expr.trim(), {
      displayMode: display,
      throwOnError: false,
      strict: false,
      trust: false,
    });
  } catch {
    return "";
  }
}

function sanitizeText(raw: string): string {
  return raw
    .replace(/\\\\/g, "\u200B")
    .replace(/\\"/g, "\"")
    .replace(/\u200B/g, "\\");
}

export default function KatexRenderer({ text, displayMode = false }: KatexRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const segments = useMemo(() => {
    const parts: Array<{ type: "text" | "math" | "block-math"; value: string }> = [];
    const sanitized = sanitizeText(text);

    const regex = /(\$\$([\s\S]+?)\$\$|\$([^$]+)\$)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(sanitized)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          value: sanitized.slice(lastIndex, match.index),
        });
      }

      if (match[2] !== undefined) {
        parts.push({ type: "block-math", value: match[2].trim() });
      } else if (match[3] !== undefined) {
        parts.push({ type: "math", value: match[3].trim() });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < sanitized.length) {
      parts.push({ type: "text", value: sanitized.slice(lastIndex) });
    }

    return parts;
  }, [text]);

  if (!mounted) {
    return <span>{text.replace(/\$[^$]+\$/g, "").replace(/\$\$[\s\S]*?\$\$/g, "")}</span>;
  }

  return (
    <span ref={containerRef}>
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <span key={i}>{seg.value}</span>;
        }
        if (seg.type === "math" || seg.type === "block-math") {
          const html = renderMath(
            seg.value,
            seg.type === "block-math" ? true : displayMode
          );
          if (!html) {
            return <span key={i} className="text-zinc-500">{seg.value}</span>;
          }
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        return null;
      })}
    </span>
  );
}
