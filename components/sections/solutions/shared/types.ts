import type { Messages } from "@/lib/i18n";

export type SolutionCopy = Messages["solutionPages"];
export type SolutionCommon = SolutionCopy["common"];

/** Every solution page component receives the full dictionary. */
export type SolutionPageProps = { t: Messages };
