import type { CSSProperties } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOOKS, type CodeLook, type LookId } from "@/lib/looks";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .36 0 0 0 0 .29 0 0 0 0 .18 0 0 0 .1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Each look's ground and the way its cards sit on it, for the small previews. */
function ground(id: LookId, accent: string): CSSProperties {
  const tint = (pct: number) => `color-mix(in oklab, ${accent} ${pct}%, transparent)`;
  if (id === "midnight") return { backgroundImage: `radial-gradient(120% 70% at 92% -10%, ${tint(38)}, transparent 70%)` };
  if (id === "soft") return { backgroundImage: `radial-gradient(70% 60% at 95% 0%, ${tint(20)}, transparent 70%), radial-gradient(60% 50% at 0% 100%, ${tint(14)}, transparent 70%)` };
  if (id === "paper") return { backgroundImage: GRAIN };
  if (id === "mono") return { backgroundImage: "linear-gradient(#ececec 1px, transparent 1px), linear-gradient(90deg, #ececec 1px, transparent 1px)", backgroundSize: "9px 9px" };
  if (id === "bold") return { backgroundImage: "radial-gradient(rgb(20 17 10 / 0.18) 1px, transparent 1.2px)", backgroundSize: "7px 7px" };
  return {};
}

function cardStyle(id: LookId): CSSProperties {
  const s = LOOKS[id].swatch;
  if (id === "bold") return { background: s.card, border: `1.5px solid ${s.ink}`, boxShadow: `2px 2px 0 0 ${s.ink}`, borderRadius: s.radius };
  if (id === "soft") return { background: s.card, boxShadow: "0 4px 12px -6px rgb(76 54 140 / 0.35)", borderRadius: s.radius };
  if (id === "mono") return { background: s.card, border: `1px solid ${s.ink}`, borderRadius: s.radius };
  return { background: s.card, border: `1px solid ${s.line}`, borderRadius: s.radius };
}

/**
 * A look drawn as a tiny app: a sidebar, a title in the look's own heading face, two key numbers and a
 * list, on the look's ground. The accent is the app's brand colour where there is one.
 */
export function LookPreview({ look, accent, className }: { look: LookId; accent?: string; className?: string }) {
  const l = LOOKS[look];
  const s = l.swatch;
  const a = accent ?? s.accent;
  const card = cardStyle(look);
  const bar = (w: string, color: string, h = 3) => <i className="block rounded-full" style={{ width: w, height: h, background: color }} />;
  return (
    <div aria-hidden className={cn("relative flex aspect-[4/3] overflow-hidden", className)} style={{ background: s.page, color: s.ink, ...ground(look, a) }}>
      <div className="flex w-[24%] shrink-0 flex-col gap-1.5 p-1.5" style={{ background: s.card, borderRight: `${look === "bold" ? 1.5 : 1}px solid ${s.line}` }}>
        <i className="block size-2.5" style={{ borderRadius: Math.min(s.radius, 4), background: `linear-gradient(135deg, ${a}, color-mix(in oklab, ${a} 55%, ${s.ink}))` }} />
        <i className="mt-0.5 block h-2 rounded-sm" style={{ background: `color-mix(in oklab, ${a} 16%, ${s.card})` }} />
        {bar("80%", s.line)}
        {bar("62%", s.line)}
        {bar("70%", s.line)}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2">
        <p className="truncate text-[11px] font-bold leading-none" style={{ fontFamily: s.heading, ...(look === "mono" ? { textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 9 } : null) }}>
          {look === "mono" ? "Inbox_" : "Inbox"}
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-1 p-1.5" style={card}>
              <span className="text-[10px] font-bold leading-none tabular-nums" style={{ fontFamily: s.heading, color: i === 0 ? a : s.ink }}>{i === 0 ? "24" : "7"}</span>
              {bar("70%", s.quiet, 2)}
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col justify-around px-1.5 py-1" style={card}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <i className="block size-1.5 shrink-0 rounded-full" style={{ background: i === 0 ? a : s.line }} />
              {bar(i === 1 ? "55%" : "75%", s.quiet, 2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A look as a button: its tiny app, its name and a few words. Selection looks the same as everywhere else in Prod AI. */
export function LookCard({
  look,
  accent,
  on,
  onPick,
  size = "md",
}: {
  look: CodeLook;
  accent?: string;
  on: boolean;
  onPick: (look: CodeLook, el: HTMLButtonElement) => void;
  size?: "sm" | "md";
}) {
  const name = look === "auto" ? "Its own look" : LOOKS[look].name;
  const line = look === "auto" ? "Designed for your idea" : LOOKS[look].line;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => onPick(look, e.currentTarget)}
      className={cn(
        "group flex shrink-0 flex-col gap-2 rounded-md p-1.5 text-left transition-colors duration-150 ease-paper active:translate-y-px",
        size === "sm" ? "w-36" : "w-full",
        on ? "bg-brand-soft ring-1 ring-brand/30" : "hover:bg-deep/60",
      )}
    >
      {look === "auto" ? (
        <div aria-hidden className="sketch-soft grid aspect-[4/3] place-items-center rounded-sm text-muted-foreground">
          <Sparkles className="size-5" />
        </div>
      ) : (
        <LookPreview look={look} accent={accent} className="rounded-sm ring-1 ring-foreground/10" />
      )}
      <span className="px-0.5 pb-0.5">
        <span className={cn("block text-ui font-medium", on ? "text-brand" : "text-foreground")}>{name}</span>
        <span className="block text-meta text-muted-foreground">{line}</span>
      </span>
    </button>
  );
}
