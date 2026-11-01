import type { FreeText, JcardArea } from '../model/editor-model';

export type Selection =
  | { readonly kind: 'text'; readonly id: string }
  | { readonly kind: 'area'; readonly id: string };

export type ClipboardItem =
  | { readonly kind: 'text'; readonly value: FreeText }
  | { readonly kind: 'area'; readonly value: JcardArea };

export function findSelectedText(selection: Selection | undefined, texts: readonly FreeText[]) {
  return selection?.kind === 'text' ? texts.find((text) => text.id === selection.id) : undefined;
}

export function findSelectedArea(selection: Selection | undefined, areas: readonly JcardArea[]) {
  return selection?.kind === 'area' ? areas.find((area) => area.id === selection.id) : undefined;
}
