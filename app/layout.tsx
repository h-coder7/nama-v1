import type { ReactNode } from "react";

// The real root layout (<html>, <body>) is app/[locale]/layout.tsx.
// This pass-through exists so app/not-found.tsx can handle URLs outside a locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
