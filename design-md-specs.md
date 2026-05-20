<!--file generated from https://stitch.withgoogle.com/docs/design-md/specification.md -->

A DESIGN.md file has two layers. The **YAML front matter** contains machine-readable design tokens â€” the precise values agents use to enforce consistency. The **markdown body** provides human-readable design rationale organized into `##` sections. Prose may use descriptive color names (e.g., "Midnight Forest Green") that correspond to systematic token names (e.g., `primary`). The tokens are the normative values; the prose provides context for how to apply them.

The spec is a **foundation, not a prescription**. It provides common ground that agents, tools, and teams can rely on, while preserving the freedom to extend the format for domain-specific needs.

## Design tokens

DESIGN.md embeds design tokens as YAML front matter at the beginning of the file. The front matter block must begin with a line containing exactly `---` and end with a line containing exactly `---`. The YAML content between these delimiters follows the schema defined below.

The token system is inspired by the [W3C Design Token Format](https://www.designtokens.org/). Tokens are easily converted to and from `tokens.json`, Figma variables, and Tailwind theme configs.

```yaml
---
version: alpha
name: Daylight Prestige
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
rounded:
  sm: 4px
  md: 8px
spacing:
  sm: 8px
  md: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
    padding: 12px
---
```

### Schema

```yaml
version: <string>          # optional, current version: "alpha"
name: <string>
description: <string>      # optional
colors:
  <token-name>: 
typography:
  <token-name>: 
rounded:
  <scale-level>: 
spacing:
  <scale-level>: 
components:
  <component-name>:
    <token-name>: <string | token reference>
```

The `<scale-level>` placeholder represents a named level in a sizing or spacing scale. Common level names include `xs`, `sm`, `md`, `lg`, `xl`, and `full`. Any descriptive string key is valid.

## Token types

| Type | Format | Example |
|---|---|---|
| **Color** | `#` + hex code (sRGB) | `"#1A1C1E"` |
| **Dimension** | number + unit (`px`, `em`, `rem`) | `48px`, `-0.02em` |
| **Token Reference** | `{path.to.token}` | `{colors.primary}` |
| **Typography** | composite object | See properties below |

### Typography properties

| Property | Type | Description |
|---|---|---|
| `fontFamily` | string | The font family name |
| `fontSize` | Dimension | The font size |
| `fontWeight` | number | Numeric weight (e.g., `400`, `700`). In YAML, bare numbers and quoted strings are equivalent |
| `lineHeight` | Dimension \| number | A dimension (e.g., `24px`) or a unitless multiplier (e.g., `1.6`). Unitless is recommended |
| `letterSpacing` | Dimension | Letter spacing adjustment |
| `fontFeature` | string | Configures [`font-feature-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-feature-settings) |
| `fontVariation` | string | Configures [`font-variation-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variation-settings) |

### Token references

A token reference is wrapped in curly braces and contains an object path to another value in the YAML tree. For most token groups, the reference must point to a primitive value (e.g., `{colors.primary-60}`), not a group. Within the `components` section, references to composite values (e.g., `{typography.label-md}`) are permitted.

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
```

## Sections

Every DESIGN.md follows the same structure. Sections can be omitted if they are not relevant to the project, but those present should appear in the sequence listed below. All sections use `##` headings. An optional `#` heading may appear for document titling purposes but is not parsed as a section.

The section structure is intentionally open-ended. The canonical sections provide a shared vocabulary; design systems are free to add domain-specific sections beyond these.

### Section order

| # | Section | Aliases |
|---|---|---|
| 1 | Overview | Brand & Style |
| 2 | Colors | |
| 3 | Typography | |
| 4 | Layout | Layout & Spacing |
| 5 | Elevation & Depth | Elevation |
| 6 | Shapes | |
| 7 | Components | |
| 8 | Do's and Don'ts | |

### Overview

Also known as "Brand & Style." A holistic description of the product's look and feel. This section defines the brand personality, target audience, and the emotional response the UI should evoke. It serves as foundational context when a specific rule or token is not defined.

```markdown
## Overview
A calm, professional interface for a healthcare scheduling platform.
Accessibility-first design with high contrast and generous touch targets.
```

### Colors

Defines the color palettes for the design system. At least the `primary` palette should be defined. Additional palettes may be named freely; a common convention is `primary`, `secondary`, `tertiary`, and `neutral`.

```markdown
## Colors

The palette is rooted in high-contrast neutrals and a single accent color.

- **Primary (#1A1C1E):** Deep ink for headlines and core text.
- **Secondary (#6C7278):** Sophisticated slate for borders, captions, metadata.
- **Tertiary (#B8422E):** The sole driver for interaction.
- **Neutral (#F7F5F2):** Warm limestone foundation.
```

**Design tokens:** A `map<string, Color>` mapping the token name to its hex value.

```yaml
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
```

### Typography

Defines typography levels. Most design systems have 9â€“15 levels, each with a semantic role (headline, body, label) and size variant (small, medium, large).

```markdown
## Typography

- **Headlines:** Public Sans Semi-Bold for an institutional voice.
- **Body:** Public Sans Regular at 16px for long-form readability.
- **Labels:** Space Grotesk for technical data and metadata.
```

**Design tokens:** A `map<string, Typography>` mapping the token name to its typography properties.

```yaml
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.1em
```

### Layout

Also known as "Layout & Spacing." Describes the layout and spacing strategy â€” grid models, spacing scales, and containment principles.

```markdown
## Layout

The layout follows a Fluid Grid model for mobile and a Fixed-Max-Width
Grid for desktop (max 1200px). A strict 8px spacing scale is used.
```

**Design tokens:** A `map<string, Dimension | number>` mapping the spacing scale identifier to a dimension or unitless number (e.g., column counts or ratios).

```yaml
spacing:
  base: 16px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 24px
  margin: 32px
```

### Elevation & Depth

Also known as "Elevation." Describes how visual hierarchy is conveyed. For designs that use shadows, it defines the shadow properties. For flat designs, it explains the alternative methods (borders, tonal layers, color contrast).

```markdown
## Elevation & Depth

Depth is achieved through tonal layers rather than heavy shadows.
Background uses a soft off-white; primary content sits on pure white cards.
```

### Shapes

Describes how visual elements are shaped â€” corner radii, edge treatments, and the overall shape language.

```markdown
## Shapes

All interactive elements use a minimal 4px corner radius.
Modern enough to feel current, rigid enough to feel engineered.
```

**Design tokens:** A `map<string, Dimension>` mapping the scale level to the corner radius.

```yaml
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
```

### Components

Style guidance for component atoms. The spec defines common component types â€” Buttons, Chips, Lists, Inputs, Checkboxes, Radio buttons, Tooltips â€” but design systems are encouraged to define additional components relevant to their domain.

```markdown
## Components
- **Buttons**: Rounded (8px), primary uses brand blue fill, secondary uses outline
- **Inputs**: 1px border, surface-variant background, 12px padding
- **Cards**: No elevation, 1px outline border, 12px corner radius
```

**Design tokens:** A `map<string, map<string, string>>` mapping a component identifier to a group of sub-token properties. Token values may be literal values or references to previously defined tokens.

**Variants.** A component may have variants for different UI states (hover, active, pressed). Variants are defined as separate component entries with a related key name.

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-70}"
```

#### Component property tokens

| Property | Type |
|---|---|
| `backgroundColor` | Color |
| `textColor` | Color |
| `typography` | Typography |
| `rounded` | Dimension |
| `padding` | Dimension |
| `size` | Dimension |
| `height` | Dimension |
| `width` | Dimension |

### Do's and Don'ts

Practical guidelines and common pitfalls. These act as guardrails during generation.

```markdown
## Do's and Don'ts

- Do use the primary color only for the single most important action per screen
- Don't mix rounded and sharp corners in the same view
- Do maintain WCAG AA contrast ratios (4.5:1 for normal text)
- Don't use more than two font weights on a single screen
```

## Consumer behavior for unknown content

The spec is designed to be extended. When a consumer encounters content not defined by this specification:

| Scenario | Behavior | Example |
|---|---|---|
| Unknown section heading | Preserve; do not error | `## Iconography` |
| Unknown color token name | Accept if value is valid | `surface-container-high: '#ede7dd'` |
| Unknown typography token name | Accept as valid typography | `telemetry-data` |
| Unknown spacing value | Accept; store as string if not a valid dimension | `grid-columns: '5'` |
| Unknown component property | Accept with warning | `borderColor` |
| Duplicate section heading | Error; reject the file | Two `## Colors` headings |

## Recommended token names

The following names are commonly used across design systems. They are not required but are provided as guidance for consistency.

**Colors:** `primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-surface`, `error`

**Typography:** `headline-display`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm`

**Rounded:** `none`, `sm`, `md`, `lg`, `xl`, `full`


