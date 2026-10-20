/** House style: no em dashes anywhere, including in what the model writes. */
export const STYLE_RULE = "Writing style: never use em dashes (the \u2014 character). Use commas, colons, periods or parentheses instead.";

export function noEmDash(s: string): string {
  if (!s.includes("\u2014")) return s;
  return s.replace(/\s*\u2014\s*/g, ", ").replace(/^, /, "").replace(/, ([.,;:!?])/g, "$1");
}

/** Deep-clean every string in model output before it is shown or saved. */
export function cleanDeep<T>(v: T): T {
  if (typeof v === "string") return noEmDash(v) as T;
  if (Array.isArray(v)) return v.map(cleanDeep) as T;
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanDeep(x)])) as T;
  return v;
}

/**
 * The product speaks as Prod AI and never names the model vendor. Notes saved before that rule (the
 * history, version labels, test-run notes) are reworded when they're read, so old projects match.
 */
export function unbrand(s: string): string;
export function unbrand(s: string | null): string | null;
export function unbrand(s: string | null): string | null {
  if (!s || !s.includes("Claude")) return s;
  return s
    .replace(/\bClaude: /g, "")
    .replace(/\b(Played|played) by Claude\b/g, "$1 by the AI")
    .replace(/\bClaude (plays|played|is playing|answers)\b/g, "the AI $1")
    .replace(/(^|[.!?]\s+)the AI/g, (_, a: string) => `${a}The AI`)
    .replace(/\bClaude\b/g, "Prod AI");
}

/** A helper's model, in words: the size of model it runs on, not a vendor's model ID. */
export function modelLabel(model: string): string {
  const m = model.toLowerCase();
  if (/haiku|mini|flash|small|fast/.test(m)) return "Fast AI model";
  if (/opus|large|pro|max/.test(m)) return "Large AI model";
  return "Standard AI model";
}
