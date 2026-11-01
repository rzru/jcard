import { isTextAlignment } from '../../model/editor-controls';
import { JCARD_FONTS, type FreeText } from '../../model/editor-model';
import type { JcardEditor } from '../../state/use-jcard-editor';
import { TrashIcon } from '../icons';
import { BoundsEditor } from './bounds-editor';

export function TextTools({
  editor,
  text,
}: {
  readonly editor: JcardEditor;
  readonly text: FreeText;
}) {
  const outlineWidth = text.style.outlineWidth ?? 0;
  const lineHeight = text.style.lineHeight ?? 1.15;

  return (
    <div className="dock-panel text-tools">
      <label className="dock-field custom-text-field">
        <span>Text</span>
        <input
          value={text.text}
          onChange={(event) => editor.updateText(text.id, { text: event.currentTarget.value })}
        />
      </label>
      <label className="dock-field font-field">
        <span>Font</span>
        <select
          value={text.style.fontId}
          style={{
            fontFamily: JCARD_FONTS.find((font) => font.id === text.style.fontId)?.family,
          }}
          onChange={(event) =>
            editor.updateTextStyle(text.id, { fontId: event.currentTarget.value })
          }
        >
          {JCARD_FONTS.map((font) => (
            <option key={font.id} value={font.id} style={{ fontFamily: font.family }}>
              {font.name}
            </option>
          ))}
        </select>
      </label>
      <label className="dock-field color-field">
        <span>Color</span>
        <input
          type="color"
          value={text.style.color}
          onChange={(event) =>
            editor.updateTextStyle(text.id, { color: event.currentTarget.value })
          }
        />
      </label>
      <label className="dock-field color-field">
        <span>Outline color</span>
        <input
          type="color"
          value={text.style.outlineColor ?? '#ffffff'}
          onChange={(event) =>
            editor.updateTextStyle(text.id, { outlineColor: event.currentTarget.value })
          }
        />
      </label>
      <label className="dock-field range-field">
        <span>Outline width</span>
        <input
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={outlineWidth}
          onChange={(event) =>
            editor.updateTextStyle(text.id, { outlineWidth: event.currentTarget.valueAsNumber })
          }
        />
        <output>{outlineWidth} pt</output>
      </label>
      <label className="dock-field range-field">
        <span>Size</span>
        <input
          type="range"
          min="5"
          max="32"
          value={text.style.size}
          onChange={(event) =>
            editor.updateTextStyle(text.id, { size: event.currentTarget.valueAsNumber })
          }
        />
        <output>{text.style.size} pt</output>
      </label>
      <label className="dock-field range-field">
        <span>Line height</span>
        <input
          type="range"
          min="0.75"
          max="2.5"
          step="0.05"
          value={lineHeight}
          onChange={(event) =>
            editor.updateTextStyle(text.id, { lineHeight: event.currentTarget.valueAsNumber })
          }
        />
        <output>{lineHeight}×</output>
      </label>
      <div className="format-buttons" aria-label="Text style">
        <button
          type="button"
          aria-label="Bold"
          aria-pressed={text.style.bold}
          onClick={() => editor.updateTextStyle(text.id, { bold: !text.style.bold })}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          aria-label="Italic"
          aria-pressed={text.style.italic}
          onClick={() => editor.updateTextStyle(text.id, { italic: !text.style.italic })}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          aria-label="Underline"
          aria-pressed={text.style.underline}
          onClick={() => editor.updateTextStyle(text.id, { underline: !text.style.underline })}
        >
          <u>U</u>
        </button>
      </div>
      <label className="dock-field align-field">
        <span>Align</span>
        <select
          value={text.style.align}
          onChange={(event) => {
            if (isTextAlignment(event.currentTarget.value)) {
              editor.updateTextStyle(text.id, { align: event.currentTarget.value });
            }
          }}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
      <label className="dock-field range-field">
        <span>Rotate</span>
        <input
          type="range"
          min="-180"
          max="180"
          value={text.rotation}
          onChange={(event) =>
            editor.updateText(text.id, { rotation: event.currentTarget.valueAsNumber })
          }
        />
        <output>{text.rotation}°</output>
      </label>
      <BoundsEditor rect={text} onChange={(update) => editor.updateText(text.id, update)} />
      <button
        className="remove-artwork"
        type="button"
        aria-label="Remove selected text"
        onClick={() => editor.removeText(text.id)}
      >
        <TrashIcon />
      </button>
    </div>
  );
}
