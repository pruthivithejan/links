import { z } from "astro/zod";

import { THEME_TOKEN_KEYS } from "./colors";
import { THEME_AVATARS, THEME_FONTS, THEME_PALETTES } from "./registry";
import type { ThemeAvatarId, ThemeFontId, ThemePaletteId } from "./registry";

const themeFontIdSchema = z.custom<ThemeFontId>((value) =>
  THEME_FONTS.some((font) => font.id === value)
);

const themePaletteIdSchema = z.custom<ThemePaletteId>((value) =>
  THEME_PALETTES.some((palette) => palette.id === value)
);

const themeAvatarIdSchema = z.custom<ThemeAvatarId>((value) =>
  THEME_AVATARS.some((avatar) => avatar.id === value)
);

export const themeModeSchema = z.enum(["light", "dark"]);

const tokenMapSchema = z
  .record(z.string(), z.string())
  .transform((tokens) =>
    Object.fromEntries(
      Object.entries(tokens).filter(([property]) =>
        THEME_TOKEN_KEYS.includes(property)
      )
    )
  );

const themeTokensSchema = z.object({
  dark: tokenMapSchema.optional(),
  light: tokenMapSchema.optional(),
});

export const themeStateSchema = z.object({
  accent: z.string(),
  avatar: themeAvatarIdSchema,
  borders: z.boolean(),
  font: themeFontIdSchema,
  headingFont: themeFontIdSchema,
  mode: themeModeSchema,
  palette: themePaletteIdSchema,
  shadows: z.boolean(),
});

export const storedThemeSchema = themeStateSchema
  .extend({ tokens: themeTokensSchema.optional() })
  .partial();

export type ThemeState = z.infer<typeof themeStateSchema>;

export type StoredTheme = z.infer<typeof storedThemeSchema>;

export type { ThemeMode } from "./registry";

export const parseStoredTheme = (raw: string | null): StoredTheme | null => {
  if (raw === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const result = storedThemeSchema.safeParse(parsed);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
};
