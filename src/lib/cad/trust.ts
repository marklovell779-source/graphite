import type { CadDocument, Trust } from "./types";

export type { Trust };

const EXPLICIT_DIMENSION =
  /(\d+(?:\.\d+)?)\s*(?:mm|in|inch|inches|")\b|(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)|(?:ø|od|diameter|id|bore|thick(?:ness)?|height)\s*\d|\bm\s*[3-8]\b/i;

export function trustOfUtterance(text: string): Trust {
  const raw = text.trim();
  if (!raw) return "guesswork";
  return EXPLICIT_DIMENSION.test(raw) ? "knowing" : "guesswork";
}

export type YieldDecision = {
  yielded: boolean;
  trust: Trust;
  reason: string;
};

/**
 * A guess never overwrites a number the user already gave.
 * A stated number may replace either. A first guess is allowed, and stays a guess.
 */
export function decideYield(current: Trust, incoming: Trust): YieldDecision {
  if (current === "knowing" && incoming === "guesswork") {
    return {
      yielded: true,
      trust: "knowing",
      reason: "Yielded. That didn't include a number, so I left the dimensions you already gave.",
    };
  }
  if (incoming === "knowing") {
    return { yielded: false, trust: "knowing", reason: "Taken as stated." };
  }
  return {
    yielded: false,
    trust: "guesswork",
    reason: "Guesswork. Confirm before you treat this as the part.",
  };
}

export function confidenceBadge(doc: Pick<CadDocument, "trust" | "confidence">): {
  label: "Knowing" | "Guesswork";
  percent: number;
  title: string;
} {
  const trust = doc.trust ?? "guesswork";
  const percent = Math.round(Math.max(0, Math.min(1, doc.confidence)) * 100);
  if (trust === "knowing") {
    return {
      label: "Knowing",
      percent,
      title: `Knowing ${percent}%. These numbers came from you. A later guess will not overwrite them.`,
    };
  }
  return {
    label: "Guesswork",
    percent,
    title: `Guesswork ${percent}%. Inferred, not confirmed. Type a dimension or answer a question.`,
  };
}
