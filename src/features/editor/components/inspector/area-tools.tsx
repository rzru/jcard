import type { ChangeEvent } from 'react';

import type { JcardArea } from '../../model/editor-model';
import type { JcardEditor } from '../../state/use-jcard-editor';
import { TrashIcon, UploadIcon } from '../icons';
import { BoundsEditor } from './bounds-editor';

import styles from '../../styles/inspector.module.css';

export function AreaTools({
  editor,
  area,
}: {
  readonly editor: JcardEditor;
  readonly area: JcardArea;
}) {
  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    editor.chooseAreaArtwork(area.id, event.currentTarget.files?.item(0) ?? undefined);
    event.currentTarget.value = '';
  }

  return (
    <div className="dock-panel area-tools">
      <button
        className="area-fill-button"
        type="button"
        aria-pressed={area.fill === 'color'}
        onClick={() => editor.updateArea(area.id, { fill: 'color' })}
      >
        Background color
      </button>
      {area.fill === 'color' ? (
        <label className="dock-field color-field">
          <span>Color</span>
          <input
            type="color"
            value={area.color}
            onChange={(event) => editor.updateArea(area.id, { color: event.currentTarget.value })}
          />
        </label>
      ) : null}
      <label className="dock-upload">
        <UploadIcon />
        <span>{area.fill === 'image' ? 'Replace artwork' : 'Use artwork'}</span>
        <input
          className={styles['upload-input']}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
        />
      </label>
      {editor.imageError === undefined ? null : (
        <p className={styles['field-error']} role="alert">
          {editor.imageError}
        </p>
      )}
      <label className="dock-field range-field">
        <span>Opacity</span>
        <input
          type="range"
          min="0"
          max="100"
          value={area.opacity}
          onChange={(event) =>
            editor.updateArea(area.id, { opacity: event.currentTarget.valueAsNumber })
          }
        />
        <output>{area.opacity}%</output>
      </label>
      <label className="dock-field range-field">
        <span>Background blur</span>
        <input
          type="range"
          min="0"
          max="20"
          value={area.blur}
          onChange={(event) =>
            editor.updateArea(area.id, { blur: event.currentTarget.valueAsNumber })
          }
        />
        <output>{area.blur} px</output>
      </label>
      <BoundsEditor rect={area} onChange={(update) => editor.updateArea(area.id, update)} />
      <button
        className="remove-artwork"
        type="button"
        aria-label="Remove selected area"
        onClick={() => editor.removeArea(area.id)}
      >
        <TrashIcon />
      </button>
    </div>
  );
}
