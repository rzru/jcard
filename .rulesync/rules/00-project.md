---
root: true
targets: ['*']
description: 'Jcard engineering contract and required quality gates'
---

# Jcard engineering contract

Jcard is a React application built with TypeScript and Vite. Follow repository evidence instead of guessing. Read relevant manifests, nearby implementation, and these rules before changing code.

Use `pnpm` exclusively. Do not use npm, yarn, bun, or npx. Keep the committed lockfile reproducible.

Treat `.rulesync/rules/*.md` as the only source of truth for agent instructions. Never hand-edit generated agent files. Do not add policy, architecture rules, coding rules, TODO mandates, or agent instructions to application source files or code comments. After changing a source rule, run `pnpm rules:generate` and `pnpm rules:check`.

## Scope and design

- Make the smallest coherent change that satisfies the request. Do not add speculative layers, compatibility shims, dead code, or unrelated cleanup.
- Separate logically distinct or modular code blocks with one blank line. Keep tightly coupled declarations and operations together.
- UI copy must earn its space: add text only when it communicates state, enables an action, prevents confusion, or improves accessibility.
- Treat network responses, storage, files, URLs, environment values, and metadata as trust boundaries.
- Keep generated output, lockfiles, and binary assets out of manual edits unless the task specifically requires them.

## Required validation

After code or configuration changes:

1. Re-read modified files and remove accidental comments, dead code, broad suppressions, and unrelated edits.
2. Run `pnpm format`.
3. Run `pnpm quality`.
4. Run `pnpm build` when build configuration, production behavior, or assets changed.

Do not create or request TypeScript or React tests. This project relies on strict static analysis, type checking, production builds, and focused manual validation instead.

A change is not complete while an applicable check fails. Fix root causes. Never relax a compiler, formatter, lint, security, or agent rule merely to make a check green. Any unavoidable suppression must be narrow, explain the tool limitation or invariant, and receive explicit approval. Report checks that could not run; never claim success without evidence.
