/** "Industry {n} / {total}" + { n: "01", total: "06" } → "Industry 01 / 06" */
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));

export const pad2 = (n: number) => String(n).padStart(2, "0");
