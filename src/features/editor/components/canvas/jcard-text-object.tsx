import { useLayoutEffect, useRef, useState } from 'react';

import { fontFamily, type FreeText, type TextStyle } from '../../model/editor-model';
import type { JcardEditor } from '../../state/use-jcard-editor';
import { TransformLayer, type AlignmentGuides } from './jcard-transform';

const POINT_TO_CANVAS_HEIGHT_PERCENT = 25.4 / 72 / 1.016;

function textSize(size: number, interactive: boolean) {
  return interactive ? `${size * POINT_TO_CANVAS_HEIGHT_PERCENT}cqh` : `${size}pt`;
}

function textOutline(style: TextStyle, interactive: boolean) {
  return `${textSize(style.outlineWidth ?? 0, interactive)} ${style.outlineColor ?? '#ffffff'}`;
}

function textLineHeight(style: TextStyle) {
  return style.lineHeight ?? 1.15;
}

export function TextObject({
  editor,
  interactive,
  item,
  onGuidesChange,
  panelWidths,
  sheetWidth,
}: {
  readonly editor: JcardEditor;
  readonly interactive: boolean;
  readonly item: FreeText;
  readonly onGuidesChange: (guides: AlignmentGuides) => void;
  readonly panelWidths: readonly number[];
  readonly sheetWidth: number;
}) {
  const [editing, setEditing] = useState(false);
  const contentRef = useRef<HTMLSpanElement>(null);
  const measuredStyleRef = useRef('');

  useLayoutEffect(() => {
    const measuredStyle = [
      item.text,
      item.style.fontId,
      item.style.size,
      textLineHeight(item.style),
      item.style.bold,
      item.style.italic,
      item.style.underline,
    ].join('|');

    if (measuredStyleRef.current === measuredStyle) {
      return;
    }

    const content = contentRef.current;
    if (content === null) {
      return;
    }

    const sheet = content.closest('.jcard-sheet');
    if (sheet === null) {
      return;
    }

    const sheetBounds = sheet.getBoundingClientRect();
    content.style.width = 'max-content';
    content.style.height = 'max-content';
    const width = Math.max(2, (content.scrollWidth / sheetBounds.width) * sheetWidth);
    const height = Math.max(2, (content.scrollHeight / sheetBounds.height) * 101.6);
    content.style.removeProperty('width');
    content.style.removeProperty('height');
    measuredStyleRef.current = measuredStyle;

    if (Math.abs(width - item.width) > 0.2 || Math.abs(height - item.height) > 0.2) {
      editor.updateText(item.id, { width, height }, false);
    }
  });

  function startEditing() {
    if (!interactive) {
      return;
    }

    setEditing(true);
    requestAnimationFrame(() => contentRef.current?.focus());
  }

  return (
    <TransformLayer
      boundsHeight={101.6}
      boundsWidth={sheetWidth}
      className={`selectable-text${editing ? ' is-editing' : ''}`}
      interactive={interactive && !editing}
      label="Move text; double-click to edit"
      panelWidths={panelWidths}
      rect={item}
      rotation={item.rotation}
      selected={interactive && editor.selectedText?.id === item.id}
      onSelect={() => editor.selectText(item.id)}
      onChange={(rect) => editor.updateText(item.id, rect, false)}
      onChangeStart={editor.recordHistory}
      onDoubleClick={startEditing}
      onGuidesChange={onGuidesChange}
    >
      <span
        ref={contentRef}
        className="selectable-text-content"
        role={editing ? 'textbox' : undefined}
        aria-label={editing ? 'Edit text' : undefined}
        contentEditable={editing}
        suppressContentEditableWarning
        style={{
          color: item.style.color,
          fontFamily: fontFamily(item.style.fontId),
          fontSize: textSize(item.style.size, interactive),
          fontStyle: item.style.italic ? 'italic' : 'normal',
          fontWeight: item.style.bold ? 750 : 400,
          lineHeight: textLineHeight(item.style),
          paintOrder: 'stroke fill',
          textAlign: item.style.align,
          textDecoration: item.style.underline ? 'underline' : 'none',
          WebkitTextStroke: textOutline(item.style, interactive),
        }}
        onBlur={(event) => {
          setEditing(false);
          editor.updateText(item.id, { text: event.currentTarget.textContent });
        }}
      >
        {item.text}
      </span>
    </TransformLayer>
  );
}
