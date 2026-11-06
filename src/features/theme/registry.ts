export const THEME_STORAGE_KEY = "links:theme-lab:v1";

export const THEME_PALETTES = [
  { accent: "#2d2d2d", id: "mono", name: "Mono" },
  { accent: "#7c5cff", id: "violet", name: "Violet" },
  { accent: "#f97316", id: "ember", name: "Ember" },
  { accent: "#0ea5e9", id: "ocean", name: "Ocean" },
  { accent: "#10b981", id: "forest", name: "Forest" },
  { accent: "#f43f5e", id: "rose", name: "Rose" },
  { accent: "#eab308", id: "sun", name: "Sun" },
  { accent: "#64748b", id: "ice", name: "Ice" },
] as const;

const systemStack =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const serifStack =
  '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';

const monoStack =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace';

export const THEME_FONTS = [
  {
    bodyLeading: "normal",
    bodyTracking: "normal",
    headingLeading: "1.15",
    headingTracking: "0.02em",
    id: "switzer",
    name: "Switzer",
    stack:
      '"Switzer-Regular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    bodyLeading: "1.55",
    bodyTracking: "-0.011em",
    googleFamily: "Manrope:wght@200..800",
    headingLeading: "1.1",
    headingTracking: "-0.02em",
    id: "manrope",
    name: "Manrope",
    stack: `"Manrope", ${systemStack}`,
  },
  {
    bodyLeading: "1.55",
    bodyTracking: "-0.009em",
    googleFamily: "DM+Sans:wght@400;500;600;700",
    headingLeading: "1.1",
    headingTracking: "-0.02em",
    id: "dmsans",
    name: "DM Sans",
    stack: `"DM Sans", ${systemStack}`,
  },
  {
    bodyLeading: "1.55",
    bodyTracking: "-0.016em",
    googleFamily: "Space+Grotesk:wght@300..700",
    headingLeading: "1.08",
    headingTracking: "-0.025em",
    id: "grotesk",
    name: "Space Grotesk",
    stack: `"Space Grotesk", ${systemStack}`,
  },
  {
    bodyLeading: "1.5",
    bodyTracking: "0",
    googleFamily: "Playfair+Display:ital,wght@0,400..900;1,400..900",
    headingLeading: "1.12",
    headingTracking: "-0.012em",
    id: "playfair",
    name: "Playfair Display",
    stack: `"Playfair Display", ${serifStack}`,
  },
  {
    bodyLeading: "1.55",
    bodyTracking: "0",
    googleFamily: "Lora:ital,wght@0,400..700;1,400..700",
    headingLeading: "1.12",
    headingTracking: "-0.01em",
    id: "lora",
    name: "Lora",
    stack: `"Lora", ${serifStack}`,
  },
  {
    bodyLeading: "1.42",
    bodyStyle: "italic",
    bodyTracking: "0.005em",
    googleFamily: "Instrument+Serif:ital@1",
    headingLeading: "1.05",
    headingStyle: "italic",
    headingTracking: "0",
    id: "instrument",
    name: "Instrument Serif",
    stack: '"Instrument Serif", Georgia, serif',
  },
  {
    bodyLeading: "1.55",
    bodyTracking: "-0.02em",
    googleFamily: "JetBrains+Mono:wght@100..800",
    headingLeading: "1.1",
    headingTracking: "-0.03em",
    id: "mono",
    name: "JetBrains Mono",
    stack: `"JetBrains Mono", ${monoStack}`,
  },
  {
    bodyLeading: "1.55",
    bodyTracking: "-0.011em",
    googleFamily: "Geist:wght@100..900",
    headingLeading: "1.1",
    headingTracking: "-0.025em",
    id: "geist",
    name: "Geist",
    stack: `"Geist", ${systemStack}`,
  },
  {
    bodyLeading: "1.55",
    bodyTracking: "-0.015em",
    googleFamily: "Geist+Mono:wght@100..900",
    headingLeading: "1.1",
    headingTracking: "-0.03em",
    id: "geistmono",
    name: "Geist Mono",
    stack: `"Geist Mono", ${monoStack}`,
  },
  {
    bodyLeading: "1.6",
    bodyTracking: "0.015em",
    googleFamily: "Geist+Pixel",
    headingLeading: "1.15",
    headingTracking: "0.01em",
    id: "geistpixel",
    name: "Geist Pixel",
    stack: `"Geist Pixel", "Geist Mono", ${monoStack}`,
  },
  {
    bodyLeading: "1.55",
    bodyTracking: "0",
    headingLeading: "1.1",
    headingTracking: "-0.015em",
    id: "geistserif",
    name: "Geist Serif",
    stack: `"Geist Serif", ${serifStack}`,
  },
] as const;

export const THEME_AVATARS = [
  {
    background: "transparent",
    borderColor: "transparent",
    borderWidth: "0",
    height: "8rem",
    id: "circle",
    imageRadius: "inherit",
    imageTransform: "none",
    mask: "none",
    name: "Rounded",
    radius: "999px",
    shadow: "0 0 0 6px var(--theme-halo, transparent)",
    transform: "none",
    width: "8rem",
  },
  {
    background: "transparent",
    borderColor: "transparent",
    borderWidth: "0",
    height: "8rem",
    id: "squircle",
    imageRadius: "inherit",
    imageTransform: "none",
    mask: "none",
    name: "Squircle",
    radius: "34%",
    shadow: "var(--shadow-card)",
    transform: "none",
    width: "8rem",
  },
  {
    background: "transparent",
    borderColor: "var(--card-border)",
    borderWidth: "1px",
    height: "8rem",
    id: "square",
    imageRadius: "inherit",
    imageTransform: "none",
    mask: "none",
    name: "Squared",
    radius: "12px",
    shadow: "none",
    transform: "none",
    width: "8rem",
  },
  {
    background: "var(--card-bg)",
    borderColor: "transparent",
    borderWidth: "0",
    height: "9rem",
    id: "check",
    imageRadius: "0",
    imageTransform: "none",
    mask: "var(--mask-verified) center / 100% 100% no-repeat",
    name: "Verified",
    radius: "0",
    shadow: "none",
    transform: "none",
    width: "9rem",
  },
] as const;

export const DEFAULT_FONT_ID = "switzer";
export const DEFAULT_PALETTE_ID = "mono";
export const DEFAULT_AVATAR_ID = "circle";

export type ThemeFontId = (typeof THEME_FONTS)[number]["id"];

export type ThemePaletteId = (typeof THEME_PALETTES)[number]["id"];

export type ThemeAvatarId = (typeof THEME_AVATARS)[number]["id"];

export type ThemeMode = "light" | "dark";

export const GOOGLE_FONTS_HREF = `https://fonts.googleapis.com/css2?${THEME_FONTS.flatMap(
  (font) => (font.googleFamily ? [`family=${font.googleFamily}`] : [])
).join("&")}&display=swap`;

export const themeFontVariables = (id: ThemeFontId) => {
  const font = THEME_FONTS.find((option) => option.id === id);

  if (!font) {
    throw new Error(`Unknown theme font: ${id}`);
  }

  return {
    "--font-body": font.stack,
    "--font-heading": font.stack,
    "--font-heading-leading": font.headingLeading,
    "--font-heading-style": font.headingStyle ?? "normal",
    "--font-heading-tracking": font.headingTracking,
    "--font-leading": font.bodyLeading,
    "--font-style": font.bodyStyle ?? "normal",
    "--font-tracking": font.bodyTracking,
  };
};

// SAFETY: THEME_FONTS has unique IDs, and each key maps to its registered font variables.
export const THEME_FONT_VARIABLES = Object.fromEntries(
  THEME_FONTS.map((font) => [font.id, themeFontVariables(font.id)])
) as Record<ThemeFontId, ReturnType<typeof themeFontVariables>>;

export const themeAvatarVariables = (id: ThemeAvatarId) => {
  const avatar = THEME_AVATARS.find((preset) => preset.id === id);

  if (!avatar) {
    throw new Error(`Unknown avatar preset: ${id}`);
  }

  return {
    "--avatar-background": avatar.background,
    "--avatar-border-color": avatar.borderColor,
    "--avatar-border-width": avatar.borderWidth,
    "--avatar-height": avatar.height,
    "--avatar-image-radius": avatar.imageRadius,
    "--avatar-image-transform": avatar.imageTransform,
    "--avatar-mask": avatar.mask,
    "--avatar-radius": avatar.radius,
    "--avatar-shadow": avatar.shadow,
    "--avatar-transform": avatar.transform,
    "--avatar-width": avatar.width,
  };
};

export const THEME_AVATAR_VARIABLES = Object.fromEntries(
  THEME_AVATARS.map((avatar) => [avatar.id, themeAvatarVariables(avatar.id)])
);

export const THEME_AVATAR_VARIABLE_KEYS = Object.keys(
  themeAvatarVariables(DEFAULT_AVATAR_ID)
);
