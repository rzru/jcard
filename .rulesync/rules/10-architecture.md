---
root: false
targets: ['*']
description: 'React application architecture and module boundaries'
---

# Architecture

Keep architecture modular. Organize modules by cohesive product semantics, give each module a narrow public boundary, and keep implementation details private. Prefer small composable units and explicit dependencies over monoliths, global registries, service locators, or cross-module reach-through. Introduce directories and abstractions only when real behavior requires them.

- Prevent dependency cycles and deep imports into another feature's private files. Move genuinely shared behavior into a cohesive shared module.
- Public module boundaries should be small and intentional. Callers must not depend on storage, transport, framework, or rendering details.
- Keep shared behavior single-sourced. Reuse an existing module or extract the smallest cohesive shared operation when two paths implement the same contract; do not force unrelated behavior through abstractions merely to remove similar syntax.
- Keep page-level components as composition shells. Put feature behavior in cohesive hooks or providers; split independently meaningful UI into components instead of accumulating render helpers and state machines in pages.
- Keep effects at system edges. Time, randomness, network, storage, and browser APIs need narrow interfaces when they influence behavior.
