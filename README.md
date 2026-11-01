<div align="center">
  <img src="./public/favicon.svg" width="81" height="60" alt="Jcard cassette icon" />
  <h1>Jcard</h1>
  <p>Design and print cassette J-cards in your browser.</p>
</div>

Jcard is a focused, free-position editor for creating cassette inserts without a general-purpose design tool. Arrange text, color, and artwork on both sides of the sheet, then print it or save it as a PDF.

## Features

- Six physical formats, from a classic 3-panel J-card to an 8-panel foldout
- Separate outside and inside layouts
- Moveable, resizable, and rotatable text and artwork areas
- Curated typography with color, size, alignment, and emphasis controls
- Image uploads with opacity and blur controls
- Fold guides, 40–320% canvas zoom, and A4/A3 print layouts
- Browser-local editing with undo, copy, paste, and delete shortcuts

## Getting started

Requires [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).

```sh
pnpm install
pnpm dev
```

Open the local URL shown by Vite.

## Commands

| Command        | Purpose                                      |
| -------------- | -------------------------------------------- |
| `pnpm dev`     | Start the development server                 |
| `pnpm build`   | Type-check and create a production build     |
| `pnpm preview` | Preview the production build                 |
| `pnpm format`  | Format the codebase                          |
| `pnpm quality` | Run formatting, lint, type, and rules checks |

## Keyboard shortcuts

| Shortcut                                    | Action                     |
| ------------------------------------------- | -------------------------- |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>C</kbd> | Copy the selected object   |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>V</kbd> | Paste an object            |
| <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Z</kbd> | Undo                       |
| <kbd>Backspace</kbd>                        | Delete the selected object |

## Printing

Choose whether fold lines should be included, then select **Print / Save PDF**. Jcard uses the browser print dialog and lays out the selected format on A4 or A3 landscape pages.

## Tech stack

React 19 · TypeScript · Vite · CSS Modules
