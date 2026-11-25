import { Fragment } from "react";

/**
 * Tiny formatter for translated headings:
 *   "*accent*" → <span class={accentClass}>  ·  "~muted~" → <span class={mutedClass}>  ·  "\n" → <br />
 * Keeps markup out of the JSON while letting designers mark the yellow words.
 */
/** Lets an accent run across "\n": "*two\nlines*" → "*two*", "*lines*". */
export function balanceLines(text: string) {
  const out: string[] = [];
  let open = "";
  for (const raw of text.split("\n")) {
    let line = open + raw;
    open = "";
    for (const m of ["*", "~"]) {
      if ((line.split(m).length - 1) % 2 === 1) {
        line += m;
        open += m;
      }
    }
    out.push(line);
  }
  return out;
}

export function RichText({ text, accentClass = "accent", mutedClass = "muted" }: { text: string; accentClass?: string; mutedClass?: string }) {
  const lines = balanceLines(text);
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {line.split(/(\*[^*]+\*|~[^~]+~)/g).map((part, pi) =>
            part.length > 2 && ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("~") && part.endsWith("~"))) ? (
              <span key={pi} className={part.startsWith("*") ? accentClass : mutedClass}>
                {part.slice(1, -1)}
              </span>
            ) : (
              <Fragment key={pi}>{part}</Fragment>
            ),
          )}
          {li < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}
