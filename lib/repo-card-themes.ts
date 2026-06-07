export const CARD_THEMES = [
  {
    bg: "bg-card-sky",
    title: "text-card-sky-ink",
    meta: "text-card-sky-muted",
    body: "text-card-sky-body",
    divider: "bg-card-sky-ink/10",
    chip: "bg-paper-white/80 text-card-sky-ink",
    stat: "text-card-sky-ink",
    avatar: "bg-magenta-tile",
  },
  {
    bg: "bg-card-lilac",
    title: "text-card-lilac-ink",
    meta: "text-card-lilac-muted",
    body: "text-card-lilac-body",
    divider: "bg-card-lilac-ink/10",
    chip: "bg-paper-white/80 text-card-lilac-ink",
    stat: "text-card-lilac-ink",
    avatar: "bg-iris-glow",
  },
  {
    bg: "bg-card-petal",
    title: "text-card-petal-ink",
    meta: "text-card-petal-muted",
    body: "text-card-petal-body",
    divider: "bg-card-petal-ink/10",
    chip: "bg-paper-white/80 text-card-petal-ink",
    stat: "text-card-petal-ink",
    avatar: "bg-magenta-tile",
  },
] as const;

export type CardTheme = (typeof CARD_THEMES)[number];

export function getCardTheme(index: number): CardTheme {
  return CARD_THEMES[index % CARD_THEMES.length];
}
