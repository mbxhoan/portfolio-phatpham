"use client";

import React from "react";
import { Info } from "lucide-react";

interface RichDocumentRendererProps {
  content: string;
  className?: string;
}

export function RichDocumentRenderer({ content, className = "" }: RichDocumentRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let keyIndex = 0;
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block handling
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={keyIndex++}
            className="my-4 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-100 shadow-inner"
          >
            <code>{codeBuffer.join("\n")}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={keyIndex++} className="h-2" />);
      continue;
    }

    // Image markdown: ![alt|align](url) or ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const rawAlt = imgMatch[1] || "Ảnh minh họa";
      const src = imgMatch[2];

      let align = "center";
      let altText = rawAlt;

      if (rawAlt.includes("|")) {
        const parts = rawAlt.split("|");
        altText = parts[0] || "Ảnh minh họa";
        align = parts[1] || "center";
      }

      let wrapperClass = "my-6 flex flex-col items-center justify-center";
      let imgClass = "max-h-[600px] w-auto max-w-full object-contain rounded-2xl border border-slate-200 shadow-sm";

      if (align === "left") {
        wrapperClass = "my-6 flex flex-col items-start justify-start md:float-left md:mr-6 md:mb-4 md:max-w-[50%]";
      } else if (align === "right") {
        wrapperClass = "my-6 flex flex-col items-end justify-end md:float-right md:ml-6 md:mb-4 md:max-w-[50%]";
      } else {
        wrapperClass = "my-6 flex flex-col items-center justify-center w-full";
      }

      elements.push(
        <figure key={keyIndex++} className={wrapperClass}>
          <div className="overflow-hidden rounded-2xl bg-slate-100/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={altText} className={imgClass} />
          </div>
          {altText && altText !== "Ảnh minh họa" && (
            <figcaption className="mt-2 text-center text-xs font-medium text-slate-500 italic">
              {altText}
            </figcaption>
          )}
        </figure>
      );
      continue;
    }

    // Callout box: > 💡 **Ghi chú**: ... or > ...
    if (trimmed.startsWith(">")) {
      const calloutText = trimmed.replace(/^>\s*/, "");
      elements.push(
        <div
          key={keyIndex++}
          className="my-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900 text-sm shadow-sm"
        >
          <Info size={18} className="mt-0.5 text-amber-600 flex-none" />
          <div className="flex-1 font-medium leading-relaxed">{parseInlineMarkdown(calloutText)}</div>
        </div>
      );
      continue;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={keyIndex++} className="mt-8 mb-4 font-display text-3xl font-extrabold text-navy">
          {trimmed.replace(/^#\s*/, "")}
        </h1>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={keyIndex++} className="mt-7 mb-3.5 font-display text-2xl font-bold text-navy">
          {trimmed.replace(/^##\s*/, "")}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={keyIndex++} className="mt-6 mb-3 font-display text-xl font-bold text-navy">
          {trimmed.replace(/^###\s*/, "")}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("#### ")) {
      elements.push(
        <h4 key={keyIndex++} className="mt-4 mb-2 font-display text-lg font-bold text-slate-800">
          {trimmed.replace(/^####\s*/, "")}
        </h4>
      );
      continue;
    }

    // Bullet list: - item or * item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemText = trimmed.replace(/^[-*]\s*/, "");
      elements.push(
        <li key={keyIndex++} className="ml-5 list-disc text-sm text-slate-700 leading-relaxed my-1">
          {parseInlineMarkdown(itemText)}
        </li>
      );
      continue;
    }

    // Numbered list: 1. item
    if (/^\d+\.\s/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s*/, "");
      elements.push(
        <li key={keyIndex++} className="ml-5 list-decimal text-sm text-slate-700 leading-relaxed my-1">
          {parseInlineMarkdown(itemText)}
        </li>
      );
      continue;
    }

    // Paragraph
    elements.push(
      <p key={keyIndex++} className="text-sm md:text-base text-slate-700 leading-relaxed my-2">
        {parseInlineMarkdown(line)}
      </p>
    );
  }

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}

function parseInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic text-slate-800">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
