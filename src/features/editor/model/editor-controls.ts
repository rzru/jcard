import type { CanvasRect, TextAlignment } from './editor-model';

export type RectField = keyof CanvasRect;

export const RECT_FIELDS: readonly { readonly field: RectField; readonly label: string }[] = [
  { field: 'x', label: 'X' },
  { field: 'y', label: 'Y' },
  { field: 'width', label: 'Width' },
  { field: 'height', label: 'Height' },
];

export function isTextAlignment(value: string): value is TextAlignment {
  return value === 'left' || value === 'center' || value === 'right';
}
