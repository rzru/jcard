---
root: false
targets: ['*']
description: 'Strict accessible CSS rules'
globs:
  - '**/*.css'
  - '**/*.tsx'
---

# CSS

- Keep global CSS limited to resets, document defaults, root tokens, theme definitions, and application-wide primitives.
- Prefer semantic properties and existing CSS variables. Do not add arbitrary values when a token expresses the design. Extract repeated declarations only when they encode a real reusable variant or component.
- Avoid ID selectors, `!important`, high-specificity chains, tag-qualified component classes, and selectors coupled to another component's private markup.
- Use logical properties. Keep nesting depth at most two and selector chains at most three compounds.
- Inline style is only for genuinely dynamic values, preferably through narrowly named custom properties. Static presentation belongs in owned CSS.
- Support reduced motion, visible focus, sufficient contrast, responsive layouts, and touch-friendly targets. Interaction and status must not rely only on animation, audio, color, hover, or pointer precision.
- Let Oxfmt and Stylelint own supported syntax and formatting. Fix violations instead of adding disable directives.

Do not add CSS comments containing agent instructions, coding policy, architectural mandates, or repository rules. Those belong only in `.rulesync/rules/`.
