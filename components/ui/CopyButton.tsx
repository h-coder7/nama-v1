"use client";

import { useState } from "react";

/** Small "Copy" chip next to a phone number or email; falls back silently if the clipboard is blocked. */
export function CopyButton({ value, label, done, className, doneClassName }: { value: string; label: string; done: string; className?: string; doneClassName?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={[className, copied && doneClassName].filter(Boolean).join(" ")}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked — the value stays visible as text */
        }
      }}
      aria-label={`${label} ${value}`}
    >
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  );
}
