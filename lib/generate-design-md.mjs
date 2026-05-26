import { toColorEntries, toTypographyEntries, toRoundedEntries, toSpacingEntries, stripVar } from "./tokens.mjs";

export function generateDesignMarkdown(context) {
  const { normalized, metadata = {} } = context;
  const siteProfile = normalized.siteProfile || {};
  const systemName = metadata.systemName || inferSystemName(normalized.source?.title);
  const brand = metadata.brand || systemName;
  const extractionUrl = normalized.source?.url || "Unknown URL";
  const audience = metadata.audience || siteProfile.audience || "website visitors and product users";
  const productSurface = metadata.productSurface || siteProfile.productSurface || "web app";
  const visualStyle = inferVisualStyle(normalized);

  // Compute once — shared by YAML and prose so names stay consistent
  const colorEntries = toColorEntries(normalized.colorPalette, 12);
  const typoEntries = toTypographyEntries(normalized.mainFontStyle, normalized.typographyScale);
  const roundedEntries = toRoundedEntries(normalized.radiusTokens, 8);
  const spacingEntries = toSpacingEntries(normalized.spacingScale, 10);

  const frontMatter = buildFrontMatter(systemName, { colorEntries, typoEntries, roundedEntries, spacingEntries });
  const body = buildBody({
    brand, extractionUrl, audience, productSurface, visualStyle, normalized,
    colorEntries, typoEntries, roundedEntries, spacingEntries,
  });

  return `${frontMatter}\n${body}`;
}

// --- YAML front matter ---

function buildFrontMatter(name, { colorEntries, typoEntries, roundedEntries, spacingEntries }) {
  const lines = ["---", `version: alpha`, `name: ${yamlString(name)}`];

  if (colorEntries.length > 0) {
    lines.push("colors:");
    for (const [k, v] of colorEntries) lines.push(`  ${k}: "${v}"`);
  }

  if (typoEntries.length > 0) {
    lines.push("typography:");
    for (const [entryName, props] of typoEntries) {
      lines.push(`  ${entryName}:`);
      for (const [pk, pv] of Object.entries(props)) {
        lines.push(`    ${pk}: ${yamlTypoProp(pk, pv)}`);
      }
    }
  }

  if (roundedEntries.length > 0) {
    lines.push("rounded:");
    for (const [k, v] of roundedEntries) lines.push(`  ${k}: ${v}`);
  }

  if (spacingEntries.length > 0) {
    lines.push("spacing:");
    for (const [k, v] of spacingEntries) lines.push(`  ${k}: ${v}`);
  }

  lines.push("---");
  return lines.join("\n");
}

// --- Markdown body ---

function buildBody({ brand, extractionUrl, audience, productSurface, visualStyle, normalized,
                     colorEntries, typoEntries, roundedEntries, spacingEntries }) {
  const sections = [];

  // 1. Overview
  sections.push(
    `## Overview\n${brand} — ${visualStyle} for ${audience}.\nProduct surface: ${productSurface}. Source: ${extractionUrl}.`
  );

  // 2. Colors
  const colorLines = colorEntries.map(([name, value]) => `- **${name}:** ${value}`);
  sections.push(`## Colors\n${colorLines.length > 0 ? colorLines.join("\n") : "No color palette extracted."}`);

  // 3. Typography
  const typoLines = typoEntries.map(([name, props]) => {
    const parts = [props.fontFamily || "", props.fontWeight ? `${props.fontWeight}` : "", props.fontSize ? `at ${props.fontSize}` : ""]
      .filter(Boolean).join(" ");
    return `- **${name}:** ${parts}`;
  });
  sections.push(`## Typography\n${typoLines.length > 0 ? typoLines.join("\n") : "No typography data extracted."}`);

  // 4. Layout
  const spacingLines = spacingEntries.map(([name, value]) => `- **${name}:** ${value}`);
  sections.push(`## Layout\n${spacingLines.length > 0 ? spacingLines.join("\n") : "No spacing tokens extracted."}`);

  // 5. Elevation & Depth
  const shadowLines = (normalized.shadowTokens || []).slice(0, 6).map((row) => {
    const name = stripVar(row.token).replace(/^(?:shadow|elevation|drop-shadow)-/, "");
    return `- **${name}:** ${row.value}`;
  });
  sections.push(
    `## Elevation & Depth\n${shadowLines.length > 0 ? shadowLines.join("\n") : "Flat design — depth conveyed through tonal layers and borders rather than drop shadows."}`
  );

  // 6. Shapes
  const radiusLines = roundedEntries.map(([name, value]) => `- **${name}:** ${value}`);
  sections.push(`## Shapes\n${radiusLines.length > 0 ? radiusLines.join("\n") : "No border-radius tokens extracted."}`);

  // 7. Components
  const componentLines = (normalized.componentHints || []).map(
    (item) => `- **${item.type}** (${item.count} instances)`
  );
  sections.push(`## Components\n${componentLines.length > 0 ? componentLines.join("\n") : "No component data extracted."}`);

  // 8. Do's and Don'ts
  sections.push(`## Do's and Don'ts

- Do use semantic color tokens, not raw hex values.
- Do maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text and UI components).
- Do define states for default, hover, focus-visible, active, disabled, loading, and error on every interactive component.
- Don't introduce spacing or typography values outside the token scale.
- Don't use low-contrast text or hidden focus indicators.
- Don't mix corner radius styles within the same component surface.`);

  return sections.join("\n\n");
}

// --- helpers ---

function yamlString(str) {
  return /[:#\[\]{},&*?|<>=!%@`]/.test(str) ? `"${str}"` : str;
}

function yamlTypoProp(key, value) {
  if (key === "fontFamily") return `"${value}"`;
  if (key === "fontWeight" || key === "lineHeight") return String(value);
  return value;
}

function inferSystemName(title) {
  if (!title) return "Extracted Design System";
  const clean = title
    .replace(/\s*\|\s*.*/g, "")
    .replace(/\s*-\s*.*/g, "")
    .trim();
  return clean || "Extracted Design System";
}

function inferVisualStyle(normalized) {
  const colorCount = (normalized.colorPalette || []).length;
  const spacingCount = (normalized.spacingScale || []).length;
  if (colorCount >= 8 && spacingCount >= 6) return "structured, token-driven interface";
  if (colorCount >= 5) return "clean, functional interface";
  return "minimal, utility-first interface";
}
