import {
  DEFAULT_FORMAT,
  INITIAL_TEXTS,
  JCARD_FONTS,
  JCARD_FORMATS,
  type FreeText,
  type JcardArea,
  type JcardFace,
  type TextAlignment,
  type TextStyle,
} from '../model/editor-model';

export type StoredEditor = {
  readonly formatId: string;
  readonly face: JcardFace;
  readonly texts: readonly FreeText[];
  readonly areas: readonly JcardArea[];
};

const STORAGE_KEY = 'jcard-editor-v1';

export const DEFAULT_EDITOR: StoredEditor = {
  formatId: DEFAULT_FORMAT.id,
  face: 'outside',
  texts: INITIAL_TEXTS,
  areas: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNumberInRange(value: unknown, minimum: number, maximum = Infinity): value is number {
  return (
    typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum
  );
}

function isFace(value: unknown): value is JcardFace {
  return value === 'outside' || value === 'inside';
}

function isAlignment(value: unknown): value is TextAlignment {
  return value === 'left' || value === 'center' || value === 'right';
}

function isColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

function isRect(value: Record<string, unknown>): boolean {
  return [
    isNumberInRange(value.x, 0),
    isNumberInRange(value.y, 0),
    isNumberInRange(value.width, 2),
    isNumberInRange(value.height, 2),
  ].every(Boolean);
}

function isTextStyle(value: unknown): value is TextStyle {
  if (!isRecord(value)) {
    return false;
  }

  return [
    typeof value.fontId === 'string' && JCARD_FONTS.some((font) => font.id === value.fontId),
    isColor(value.color),
    isNumberInRange(value.size, 5, 32),
    typeof value.bold === 'boolean',
    typeof value.italic === 'boolean',
    typeof value.underline === 'boolean',
    isAlignment(value.align),
  ].every(Boolean);
}

function isFreeText(value: unknown): value is FreeText {
  if (!isRecord(value)) {
    return false;
  }

  return [
    isRect(value),
    typeof value.id === 'string',
    isFace(value.face),
    typeof value.text === 'string',
    isNumberInRange(value.rotation, -180, 180),
    isTextStyle(value.style),
  ].every(Boolean);
}

function isAreaImage(fill: unknown, imageUrl: unknown): boolean {
  return (
    fill === 'color' ||
    (typeof imageUrl === 'string' && /^data:image\/(?:jpeg|png|webp);base64,/i.test(imageUrl))
  );
}

function isArea(value: unknown): value is JcardArea {
  if (!isRecord(value)) {
    return false;
  }

  return [
    isRect(value),
    typeof value.id === 'string',
    isFace(value.face),
    value.fill === 'color' || value.fill === 'image',
    isColor(value.color),
    typeof value.imageUrl === 'string',
    isAreaImage(value.fill, value.imageUrl),
    isNumberInRange(value.opacity, 0, 100),
    isNumberInRange(value.blur, 0, 20),
  ].every(Boolean);
}

function isStoredEditor(value: unknown): value is StoredEditor {
  if (!isRecord(value)) {
    return false;
  }

  return [
    typeof value.formatId === 'string' &&
      JCARD_FORMATS.some((format) => format.id === value.formatId),
    isFace(value.face),
    Array.isArray(value.texts) && value.texts.every(isFreeText),
    Array.isArray(value.areas) && value.areas.every(isArea),
  ].every(Boolean);
}

function withoutImageData(areas: readonly JcardArea[]): readonly JcardArea[] {
  return areas.map((area) =>
    area.fill === 'image' ? { ...area, fill: 'color', imageUrl: '' } : area,
  );
}

export function loadEditor(): StoredEditor | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return undefined;
    }

    const value: unknown = JSON.parse(raw);
    return isStoredEditor(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function saveEditor(editor: StoredEditor): string | undefined {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...editor, areas: withoutImageData(editor.areas) }),
    );
    return undefined;
  } catch {
    return 'Progress could not be saved. Free browser storage and try again.';
  }
}
