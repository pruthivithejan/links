import { buildThemeTokens, THEME_TOKEN_KEYS } from "./colors";
import { parseStoredTheme } from "./model";
import type { StoredTheme, ThemeState } from "./model";
import {
  DEFAULT_AVATAR_ID,
  DEFAULT_FONT_ID,
  DEFAULT_PALETTE_ID,
  THEME_AVATARS,
  THEME_AVATAR_VARIABLE_KEYS,
  THEME_BOOT_STATE_ATTRIBUTE,
  THEME_FONTS,
  THEME_MODES,
  THEME_PALETTES,
  THEME_STORAGE_KEY,
  themeAvatarVariables,
  themeFontVariables,
} from "./registry";
import type { ThemeFontId, ThemeMode } from "./registry";

const root = document.documentElement;

const morph = document.querySelector<HTMLElement>("[data-theme-lab]");
const panel = document.querySelector<HTMLElement>("[data-theme-panel]");

const trigger = document.querySelector<HTMLButtonElement>(
  "[data-theme-trigger]"
);

const closeButton =
  document.querySelector<HTMLButtonElement>("[data-theme-close]");

const shuffleButton = document.querySelector<HTMLButtonElement>(
  "[data-theme-shuffle]"
);

const resetButton =
  document.querySelector<HTMLButtonElement>("[data-theme-reset]");

const bordersToggle = document.querySelector<HTMLButtonElement>(
  "[data-theme-borders]"
);

const shadowsToggle = document.querySelector<HTMLButtonElement>(
  "[data-theme-shadows]"
);

const modeButtons = [
  ...document.querySelectorAll<HTMLButtonElement>("[data-mode]"),
];

const paletteButtons = [
  ...document.querySelectorAll<HTMLButtonElement>("[data-palette]"),
];

const bodyFontSelect = document.querySelector<HTMLSelectElement>(
  'select[data-font-choice="body"]'
);

const headingFontSelect = document.querySelector<HTMLSelectElement>(
  'select[data-font-choice="heading"]'
);

const avatarPresetButtons = [
  ...document.querySelectorAll<HTMLButtonElement>("button[data-avatar-preset]"),
];

const palettes = THEME_PALETTES.flatMap((palette) => {
  const button = paletteButtons.find(
    (candidate) => candidate.dataset.palette === palette.id
  );

  return button ? [{ ...palette, button }] : [];
});

const avatarPresets = THEME_AVATARS.flatMap((preset) => {
  const button = avatarPresetButtons.find(
    (candidate) => candidate.dataset.avatarPreset === preset.id
  );

  return button ? [{ ...preset, button }] : [];
});

const defaultPalette =
  THEME_PALETTES.find((palette) => palette.id === DEFAULT_PALETTE_ID) ??
  THEME_PALETTES[0];

const defaultFontId = DEFAULT_FONT_ID;

const media = window.matchMedia("(prefers-color-scheme: dark)");

const isFontId = (value: string | undefined): value is ThemeFontId =>
  THEME_FONTS.some((font) => font.id === value);

const isMode = (value: string | undefined): value is ThemeMode =>
  THEME_MODES.some((mode) => mode.id === value);

const systemMode = (): ThemeMode => (media.matches ? "dark" : "light");

const readStored = () =>
  parseStoredTheme(root.dataset[THEME_BOOT_STATE_ATTRIBUTE] ?? null);

const stored = readStored();

const state: ThemeState = {
  avatar: stored?.avatar ?? DEFAULT_AVATAR_ID,
  borders: stored?.borders !== false,
  font: stored?.font ?? defaultFontId,
  headingFont: stored?.headingFont ?? defaultFontId,
  mode: stored?.mode ?? systemMode(),
  palette: stored?.palette ?? defaultPalette?.id ?? DEFAULT_PALETTE_ID,
  shadows: stored?.shadows !== false,
};

const paletteAccent = () =>
  THEME_PALETTES.find((palette) => palette.id === state.palette)?.accent ??
  defaultPalette?.accent ??
  "#2d2d2d";

let lastFocus: HTMLElement | null = null;

const tokenKeys = THEME_TOKEN_KEYS;

const isNeutralTheme = () => state.palette === defaultPalette?.id;

const applyTheme = () => {
  root.classList.toggle("dark", state.mode === "dark");

  if (isNeutralTheme()) {
    for (const key of tokenKeys) {
      root.style.removeProperty(key);
    }
  } else {
    const tokens = buildThemeTokens(paletteAccent(), state.mode);

    for (const [key, value] of Object.entries(tokens)) {
      root.style.setProperty(key, value);
    }
  }

  for (const [property, value] of Object.entries(
    themeFontVariables(state.font)
  )) {
    root.style.setProperty(property, value);
  }

  const headingVariables = themeFontVariables(state.headingFont);

  for (const property of [
    "--font-heading",
    "--font-heading-tracking",
    "--font-heading-leading",
    "--font-heading-style",
  ] as const) {
    root.style.setProperty(property, headingVariables[property]);
  }

  for (const [property, value] of Object.entries(
    themeAvatarVariables(state.avatar)
  )) {
    root.style.setProperty(property, value);
  }

  if (state.borders) {
    delete root.dataset.borders;
  } else {
    root.dataset.borders = "off";
  }

  if (state.shadows) {
    delete root.dataset.shadows;
  } else {
    root.dataset.shadows = "off";
  }
};

const persistTheme = () => {
  const neutral = isNeutralTheme();

  const payload: StoredTheme = {
    ...state,
    tokens: neutral
      ? undefined
      : {
          dark: buildThemeTokens(paletteAccent(), "dark"),
          light: buildThemeTokens(paletteAccent(), "light"),
        },
  };

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* storage can be unavailable in private windows */
  }
};

const syncUi = () => {
  for (const button of modeButtons) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.mode === state.mode)
    );
  }

  for (const palette of palettes) {
    palette.button.setAttribute(
      "aria-pressed",
      String(palette.id === state.palette)
    );
  }

  if (bodyFontSelect) {
    bodyFontSelect.value = state.font;
  }

  if (headingFontSelect) {
    headingFontSelect.value = state.headingFont;
  }

  for (const preset of avatarPresets) {
    preset.button.setAttribute(
      "aria-pressed",
      String(preset.id === state.avatar)
    );
  }

  bordersToggle?.setAttribute("aria-checked", String(state.borders));
  shadowsToggle?.setAttribute("aria-checked", String(state.shadows));
};

const update = () => {
  applyTheme();
  persistTheme();
  syncUi();
};

const setMode = (mode: ThemeMode) => {
  state.mode = mode;
  update();
};

const setPalette = (id: string) => {
  const palette = palettes.find((item) => item.id === id);

  if (!palette) {
    return;
  }

  state.palette = palette.id;
  update();
};

const setFont = (id: string) => {
  if (!isFontId(id)) {
    return;
  }

  state.font = id;
  update();
};

const setHeadingFont = (id: string) => {
  if (!isFontId(id)) {
    return;
  }

  state.headingFont = id;
  update();
};

const setAvatarPreset = (id: string) => {
  const preset = THEME_AVATARS.find((option) => option.id === id);

  if (!preset) {
    return;
  }

  state.avatar = preset.id;
  update();
};

const shuffle = () => {
  const paletteChoices = palettes.filter(
    (palette) => palette.id !== state.palette
  );

  const avatarChoices = avatarPresets.filter(
    (preset) => preset.id !== state.avatar
  );

  const fontIdList = THEME_FONTS.map((font) => font.id);
  const modes: ThemeMode[] = ["light", "dark"];

  const pickFont = (exclude: string) => {
    const choices = fontIdList.filter((id) => id !== exclude);

    return choices[Math.floor(Math.random() * choices.length)] ?? defaultFontId;
  };

  const palette =
    paletteChoices[Math.floor(Math.random() * paletteChoices.length)] ??
    palettes[Math.floor(Math.random() * palettes.length)];

  const avatar =
    avatarChoices[Math.floor(Math.random() * avatarChoices.length)] ??
    avatarPresets[Math.floor(Math.random() * avatarPresets.length)];

  const mode = modes[Math.floor(Math.random() * modes.length)] ?? "dark";

  if (palette) {
    state.palette = palette.id;
  }

  if (avatar) {
    state.avatar = avatar.id;
  }

  state.borders = Math.random() < 0.5;
  state.font = pickFont(state.font);
  state.headingFont = pickFont(state.headingFont);
  state.mode = mode;
  state.shadows = Math.random() < 0.5;
  update();
};

const reset = () => {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    /* The browser can disable local storage. */
  }

  for (const key of tokenKeys) {
    root.style.removeProperty(key);
  }

  delete root.dataset.borders;
  delete root.dataset.shadows;

  for (const property of THEME_AVATAR_VARIABLE_KEYS) {
    root.style.removeProperty(property);
  }

  state.avatar = DEFAULT_AVATAR_ID;
  state.borders = true;
  state.shadows = true;
  state.mode = systemMode();
  state.palette = defaultPalette?.id ?? DEFAULT_PALETTE_ID;
  state.font = defaultFontId;
  state.headingFont = defaultFontId;

  for (const [property, value] of Object.entries(
    themeFontVariables(defaultFontId)
  )) {
    root.style.setProperty(property, value);
  }

  root.classList.toggle("dark", state.mode === "dark");
  syncUi();
};

const measureOpenSize = () => {
  if (!morph || !panel) {
    return;
  }

  morph.classList.add("is-measuring");

  const height = panel.offsetHeight;

  morph.classList.remove("is-measuring");
  morph.style.setProperty("--morph-open-h", `${height}px`);
};

const openPanel = () => {
  if (!morph || !panel || !trigger) {
    return;
  }

  panel.removeAttribute("hidden");
  measureOpenSize();
  lastFocus =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  morph.dataset.open = "true";
  panel.removeAttribute("inert");
  panel.setAttribute("aria-hidden", "false");
  trigger.setAttribute("aria-expanded", "true");
  trigger.setAttribute("aria-label", "Close theme lab");
  trigger.tabIndex = -1;

  window.requestAnimationFrame(() => panel.focus({ preventScroll: true }));
};

const closePanel = (restoreFocus = true) => {
  if (!morph || !panel || !trigger) {
    return;
  }

  morph.dataset.open = "false";
  panel.setAttribute("aria-hidden", "true");
  panel.setAttribute("inert", "");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-label", "Open theme lab");
  trigger.tabIndex = 0;

  if (restoreFocus) {
    (lastFocus ?? trigger).focus({ preventScroll: true });
  }
};

applyTheme();

syncUi();

for (const button of modeButtons) {
  button.addEventListener("click", () => {
    if (isMode(button.dataset.mode)) {
      setMode(button.dataset.mode);
    }
  });
}

for (const palette of palettes) {
  palette.button.addEventListener("click", () => setPalette(palette.id));
}

if (bodyFontSelect) {
  bodyFontSelect.addEventListener("change", () => {
    setFont(bodyFontSelect.value);
  });
}

if (headingFontSelect) {
  headingFontSelect.addEventListener("change", () => {
    setHeadingFont(headingFontSelect.value);
  });
}

for (const preset of avatarPresets) {
  preset.button.addEventListener("click", () => setAvatarPreset(preset.id));
}

bordersToggle?.addEventListener("click", () => {
  state.borders = !state.borders;
  update();
});

shadowsToggle?.addEventListener("click", () => {
  state.shadows = !state.shadows;
  update();
});

shuffleButton?.addEventListener("click", shuffle);

resetButton?.addEventListener("click", reset);

trigger?.addEventListener("click", () => {
  if (morph?.dataset.open === "true") {
    closePanel();
  } else {
    openPanel();
  }
});

closeButton?.addEventListener("click", () => closePanel());

document.addEventListener("pointerdown", (event) => {
  if (!morph || morph.dataset.open !== "true") {
    return;
  }

  const target = event.target instanceof Node ? event.target : null;

  if (target && !morph.contains(target)) {
    closePanel(false);
  }
});

document.addEventListener("keydown", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;

  const isTyping =
    target?.isContentEditable || target?.matches("input, textarea, select");

  if (event.key === "Escape" && morph?.dataset.open === "true") {
    event.preventDefault();
    closePanel();

    return;
  }

  if (
    event.key.toLowerCase() === "t" &&
    event.shiftKey &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !isTyping
  ) {
    event.preventDefault();

    if (morph?.dataset.open === "true") {
      closePanel();
    } else {
      openPanel();
    }
  }
});

window.requestAnimationFrame(measureOpenSize);

window.addEventListener("resize", measureOpenSize);

document.fonts.addEventListener("loadingdone", measureOpenSize);
