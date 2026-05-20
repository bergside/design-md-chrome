// Shared token builders — recommended names per design-md-specs.md
// Used by both generate-design-md.mjs and generate-skill-md.mjs

export const COLOR_RECOMMENDED = ["primary", "secondary", "tertiary", "neutral", "surface", "on-surface", "error"];
export const TYPO_ABOVE_BODY = ["headline-display", "headline-lg", "headline-md"];
export const TYPO_BELOW_BODY = ["body-sm", "label-lg", "label-md", "label-sm"];
export const SPACING_SCALE = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];
export const ROUNDED_ORDER = ["none", "sm", "md", "lg", "xl", "full"];

const COLOR_SEMANTIC_PATTERNS = new Map([
  ["primary",    /primary|brand|(?<![a-z])accent(?![a-z])|^main/i],
  ["secondary",  /secondary/i],
  ["tertiary",   /tertiary/i],
  ["neutral",    /neutral|gr[ae]y/i],
  ["surface",    /^surface$|background$|^bg$/i],
  ["on-surface", /on-surface|foreground|on-bg/i],
  ["error",      /error|danger|destructive/i],
]);

export function toColorEntries(colorPalette, limit) {
  if (!colorPalette || colorPalette.length === 0) return [];

  const rows = colorPalette.slice(0, limit);
  const used = new Set();

  const entries = rows.map((row) => {
    const raw = stripVar(row.token);
    for (const [name, pattern] of COLOR_SEMANTIC_PATTERNS) {
      if (!used.has(name) && pattern.test(raw)) {
        used.add(name);
        return { name, value: row.value };
      }
    }
    return { name: null, value: row.value, token: row.token };
  });

  const remaining = COLOR_RECOMMENDED.filter((n) => !used.has(n));
  let ri = 0;
  for (const entry of entries) {
    if (!entry.name) {
      entry.name = remaining[ri] ?? stripVar(entry.token);
      ri++;
    }
  }

  return entries.map((e) => [e.name, e.value]);
}

export function toTypographyEntries(mainFontStyle, typographyScale) {
  if (!mainFontStyle?.familyStack) return [];

  const family = mainFontStyle.primaryFamily || mainFontStyle.familyStack;
  const bodySize = mainFontStyle.size;
  const bodyPx = bodySize ? toPx(bodySize) : 16;
  const scale = typographyScale || [];
  const entries = [];

  const above = scale
    .filter((row) => toPx(row.value) > bodyPx)
    .sort((a, b) => toPx(b.value) - toPx(a.value));

  const below = scale
    .filter((row) => toPx(row.value) < bodyPx)
    .sort((a, b) => toPx(b.value) - toPx(a.value));

  above.slice(0, 3).forEach((row, i) => {
    const props = {};
    if (family) props.fontFamily = family;
    props.fontSize = row.value;
    if (mainFontStyle.weight) props.fontWeight = toNumeric(mainFontStyle.weight);
    entries.push([TYPO_ABOVE_BODY[i], props]);
  });

  const bodyProps = {};
  if (family) bodyProps.fontFamily = family;
  if (bodySize) bodyProps.fontSize = bodySize;
  if (mainFontStyle.weight) bodyProps.fontWeight = toNumeric(mainFontStyle.weight);
  if (mainFontStyle.lineHeight) bodyProps.lineHeight = toNumeric(mainFontStyle.lineHeight);
  entries.push(["body-md", bodyProps]);

  below.slice(0, 4).forEach((row, i) => {
    const props = {};
    if (family) props.fontFamily = family;
    props.fontSize = row.value;
    if (mainFontStyle.weight) props.fontWeight = toNumeric(mainFontStyle.weight);
    entries.push([TYPO_BELOW_BODY[i], props]);
  });

  return entries;
}

export function toRoundedEntries(radiusTokens, limit) {
  if (!radiusTokens || radiusTokens.length === 0) return [];

  const items = radiusTokens.slice(0, limit).map((row) => ({
    value: row.value,
    px: toPx(row.value),
    raw: String(row.value).toLowerCase(),
    name: null,
  }));

  const used = new Set();
  for (const item of items) {
    if (!used.has("none") && (item.px === 0 || item.raw === "none" || item.raw === "0px")) {
      item.name = "none";
      used.add("none");
    } else if (!used.has("full") && (item.px >= 500 || item.raw === "9999px" || item.raw.includes("50%"))) {
      item.name = "full";
      used.add("full");
    }
  }

  const scaleNames = ["sm", "md", "lg", "xl"].filter((n) => !used.has(n));
  const untagged = items.filter((i) => !i.name).sort((a, b) => a.px - b.px);
  untagged.forEach((item, i) => { item.name = scaleNames[i] ?? `r${i + 1}`; });

  items.sort((a, b) => {
    const ai = ROUNDED_ORDER.indexOf(a.name);
    const bi = ROUNDED_ORDER.indexOf(b.name);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return items.map((i) => [i.name, i.value]);
}

export function toSpacingEntries(spacingScale, limit) {
  if (!spacingScale || spacingScale.length === 0) return [];

  const rows = spacingScale.slice(0, limit);
  const cleaned = rows.map((row) => ({
    name: stripVar(row.token).replace(/^(?:spacing|space|gap)-/, ""),
    value: row.value,
    px: toPx(row.value),
  }));

  if (cleaned.every((item) => SPACING_SCALE.includes(item.name))) {
    return cleaned.map((item) => [item.name, item.value]);
  }

  const sorted = [...cleaned].sort((a, b) => a.px - b.px);
  return sorted.map((item, i) => [SPACING_SCALE[i] ?? item.name, item.value]);
}

export function stripVar(token) {
  return token.replace(/^--/, "").toLowerCase();
}

export function toPx(val) {
  const m = String(val).match(/^([\d.]+)(px|rem|em)?$/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = m[2] || "px";
  if (unit === "rem" || unit === "em") return n * 16;
  return n;
}

export function toNumeric(val) {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
}
