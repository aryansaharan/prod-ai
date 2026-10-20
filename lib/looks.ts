/**
 * Looks: the whole style of an app people make, beyond its brand colour. A business app wears its look
 * through the renderer (app/globals.css scopes each one under [data-look]); a code app is written to it
 * (the direction below goes into the prompt). The brand colour stays the person's own in every look.
 */

export const LOOK_IDS = ["clean", "paper", "midnight", "soft", "mono", "bold"] as const;
export type LookId = (typeof LOOK_IDS)[number];

/** A code app may also be left to Prod AI, which then designs a look for the idea itself. */
export type CodeLook = LookId | "auto";

export type Look = {
  id: LookId;
  name: string;
  /** A few plain words under the name. */
  line: string;
  dark: boolean;
  /** For the small previews: page, card, ink, quiet text, lines, corner radius in px, and a stand-in brand colour. */
  swatch: { page: string; card: string; ink: string; quiet: string; line: string; radius: number; accent: string; heading: string };
  /** How a code app is written in this look. */
  direction: string;
};

export const LOOKS: Record<LookId, Look> = {
  clean: {
    id: "clean",
    name: "Clean",
    line: "Crisp and familiar",
    dark: false,
    swatch: { page: "#F8FAFC", card: "#FFFFFF", ink: "#0F172A", quiet: "#94A3B8", line: "#E2E8F0", radius: 6, accent: "#0F766E", heading: "var(--font-work)" },
    direction:
      "Clean and modern: cool slate neutrals (#F8FAFC page, white cards, #0F172A text, #64748B secondary text, #E2E8F0 hairlines), Hanken Grotesk for everything, 10 to 12 px corners, light shadows, generous whitespace.",
  },
  paper: {
    id: "paper",
    name: "Paper",
    line: "Warm and editorial",
    dark: false,
    swatch: { page: "#F7F3EA", card: "#FFFDF8", ink: "#1F1B15", quiet: "#A39A88", line: "#E3DCCD", radius: 4, accent: "#9A3412", heading: "var(--font-look-serif)" },
    direction:
      "Warm and editorial: an ivory paper page (#F7F3EA) with off-white cards (#FFFDF8), warm ink text (#1F1B15, secondary #7C7464), warm hairlines (#E3DCCD), Newsreader for headings and Hanken Grotesk for the rest, 6 to 8 px corners, a faint paper grain, the accent used sparingly like a stamp.",
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    line: "Dark and luminous",
    dark: true,
    swatch: { page: "#0B0E17", card: "#141A2A", ink: "#F3F5FA", quiet: "#66708A", line: "#232B3D", radius: 6, accent: "#818CF8", heading: "var(--font-work)" },
    direction:
      "Dark and luminous: a near-black navy page (#0B0E17), surfaces #111624 with #232B3D borders, light text (#F3F5FA, secondary #8B94AB), soft radial glows of the accent colour behind the main areas, crisp Hanken Grotesk type, 10 to 12 px corners, smooth motion. Keep text contrast high on the dark ground.",
  },
  soft: {
    id: "soft",
    name: "Soft",
    line: "Rounded and friendly",
    dark: false,
    swatch: { page: "#F6F4FB", card: "#FFFFFF", ink: "#221F31", quiet: "#A29BB8", line: "#E3DEF0", radius: 12, accent: "#7C3AED", heading: "var(--font-look-round)" },
    direction:
      "Soft and friendly: lavender-tinted neutrals (#F6F4FB page, white cards, #221F31 text, #7D7694 secondary), Nunito for everything, big 16 to 24 px corners, pill-shaped buttons, airy spacing, soft diffuse shadows, gentle blurred colour blobs behind the content.",
  },
  mono: {
    id: "mono",
    name: "Mono",
    line: "Sharp and precise",
    dark: false,
    swatch: { page: "#FAFAFA", card: "#FFFFFF", ink: "#111111", quiet: "#9A9A9A", line: "#D4D4D4", radius: 1, accent: "#111111", heading: "var(--font-code)" },
    direction:
      "Precise and monochrome: black, white and greys plus the one accent colour, JetBrains Mono for headings, labels and numbers with Hanken Grotesk for body text, sharp 2 px corners, 1 px rules, no shadows, a faint square grid behind the page.",
  },
  bold: {
    id: "bold",
    name: "Bold",
    line: "Loud and graphic",
    dark: false,
    swatch: { page: "#FBF6E9", card: "#FFFDF5", ink: "#14110A", quiet: "#9C8F6C", line: "#14110A", radius: 4, accent: "#E4572E", heading: "var(--font-look-grotesk)" },
    direction:
      "Bold neo-brutalist: a cream page (#FBF6E9), near-black ink (#14110A), Archivo (800 for headings, 400 to 600 for text), thick 2 px black borders on cards and buttons, hard offset shadows (4px 4px 0 #14110A), saturated blocks of the accent colour, chunky buttons, a dotted grid behind the page.",
  },
};

export const LOOK_LIST: Look[] = LOOK_IDS.map((id) => LOOKS[id]);

export function isLook(v: unknown): v is LookId {
  return typeof v === "string" && (LOOK_IDS as readonly string[]).includes(v);
}

/** The look an app wears; plans saved before looks existed are Clean. */
export function lookOf(v: unknown): Look {
  return LOOKS[isLook(v) ? v : "clean"];
}

/** Words a note might use for a look ("make it dark", "the paper look"). */
export function lookFromWords(text: string): LookId | null {
  const t = text.toLowerCase();
  if (!/\b(look|style|theme|make it|switch|feel|dark mode|light mode)\b/.test(t)) return null;
  const named = LOOK_IDS.find((id) => new RegExp(`\\b${id}\\b`).test(t));
  if (named) return named;
  if (/\b(dark|night|black background)\b/.test(t)) return "midnight";
  if (/\b(brutal|brutalist|loud)\b/.test(t)) return "bold";
  if (/\b(editorial|serif|warm)\b/.test(t)) return "paper";
  if (/\b(rounded|playful|friendly|pastel)\b/.test(t)) return "soft";
  if (/\b(monochrome|minimal|terminal)\b/.test(t)) return "mono";
  if (/\b(light mode|clean|default)\b/.test(t)) return "clean";
  return null;
}
