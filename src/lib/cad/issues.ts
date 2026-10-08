import type { CadDocument, ClarifyingQuestion } from "./types";

export type OpenIssue = {
  partId: string;
  partName: string;
  question: ClarifyingQuestion;
};

export function collectIssues(parts: CadDocument[]): OpenIssue[] {
  return parts.flatMap((p) =>
    p.questions.filter((q) => !q.answered).map((question) => ({ partId: p.id, partName: p.name, question })),
  );
}
