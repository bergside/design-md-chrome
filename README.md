# TypeUI DESIGN.md Extractor (Chrome Extension)

This Chrome extension extract styles and information from any given site and generates a `DESIGN.md` or `SKILL.md` file that you can use with tools such as Google Stitch, Claude Code, Codex, and others to build websites with a given design system blueprint. The file is based on the open-source [TypeUI DESIGN.md](https://www.typeui.sh/design-md) format.

<img width="1200" height="630" alt="designmdchrome" src="https://github.com/user-attachments/assets/64efbebb-1c68-4ca1-8792-ca167d5e12d6" />

## Getting started

Load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this project folder

## Curated design skills

Check out curated design systems at [typeui.sh/design-skills](https://www.typeui.sh/design-skills).

## Available actions

| Action | Description |
| --- | --- |
| Auto-extract | Reads styles from the active tab (typography, colors, spacing, radius, shadows, motion). |
| Generate `DESIGN.md` | Produces design-system documentation markdown from extracted signals. |
| Generate `SKILL.md` | Produces agent-ready skill markdown from extracted signals. |
| Refresh | Re-runs extraction for the current page state. |
| Download | Saves generated output as `DESIGN.md` or `SKILL.md`. |
| Explain (`?`) | Shows how the file was generated, with TypeUI reference. |

## Generated file structure

The generated markdown follows this structure:

| Section | What it does |
| --- | --- |
| `Mission` | Defines the design-system objective for the extracted site. |
| `Brand` | Captures product/brand context, URL, audience, and product surface. |
| `Style Foundations` | Lists inferred visual tokens and foundations. |
| `Accessibility` | Applies WCAG 2.2 AA requirements and interaction constraints. |
| `Writing Tone` | Sets guidance tone for implementation-ready output. |
| `Rules: Do` | Lists required implementation practices. |
| `Rules: Don't` | Lists anti-patterns and prohibited behavior. |
| `Guideline Authoring Workflow` | Defines ordered guideline authoring steps. |
| `Required Output Structure` | Enforces consistent output sections. |
| `Component Rule Expectations` | Defines required interaction/state details. |
| `Quality Gates` | Adds testable quality and consistency checks. |

## Local development

Run tests locally:

```bash
node tests/run-tests.mjs
```

## License

This project is open-source under the MIT License.

## Sponsors

A huge thank you to the companies supporting our open-source work.

<table width="100%">
  <tr>
    <td align="center" width="33%">
      <a href="https://www.skybridge.tech/?ref=typeui.sh" target="_blank" rel="noopener noreferrer">
        <img src="https://github.com/user-attachments/assets/88c401ee-b19b-4b78-9a7e-325337dba529" alt="Skybridge" width="300" />
        <br /><b>Skybridge</b>
      </a>
    </td>
  </tr>
</table>

Want to see your logo here? [Become a sponsor](https://www.typeui.sh/sponsor).
