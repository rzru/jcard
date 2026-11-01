import { useState } from 'react';

import { totalWidth } from '../../model/editor-model';
import type { JcardEditor } from '../../state/use-jcard-editor';
import { CanvasViewport } from './canvas-viewport';
import { JcardSheet } from './jcard-sheet';

export function JcardPreview({
  editor,
  printFoldLines,
}: {
  readonly editor: JcardEditor;
  readonly printFoldLines: boolean;
}) {
  const width = totalWidth(editor.format);
  const [zoom, setZoom] = useState(100);

  return (
    <section className="preview-workspace" aria-labelledby="preview-heading">
      <div className="preview-toolbar">
        <div className="preview-title">
          <h1 id="preview-heading">J-card canvas</h1>
          <p>
            {width.toFixed(1)} × 101.6 mm · {editor.format.paper} landscape
          </p>
        </div>
        <div className="preview-actions">
          <div className="segmented-control" aria-label="J-card side">
            <button
              type="button"
              aria-pressed={editor.face === 'outside'}
              onClick={() => editor.selectFace('outside')}
            >
              Outside
            </button>
            <button
              type="button"
              aria-pressed={editor.face === 'inside'}
              onClick={() => editor.selectFace('inside')}
            >
              Inside
            </button>
          </div>
        </div>
      </div>

      <div className="canvas-field">
        <CanvasViewport
          aspectRatio={width / 101.6}
          widthLabel={`${width.toFixed(1)} MM`}
          heightLabel="101.6 MM"
          onBackgroundPointerDown={editor.clearSelection}
          zoom={zoom}
        >
          <JcardSheet editor={editor} face={editor.face} />
        </CanvasViewport>
        <label className="canvas-controls">
          <span>Zoom</span>
          <input
            type="range"
            min="40"
            max="320"
            step="5"
            value={zoom}
            onChange={(event) => setZoom(event.currentTarget.valueAsNumber)}
          />
          <output aria-live="polite">{zoom}%</output>
        </label>
      </div>

      <div
        className={`print-pages paper-${editor.format.paper.toLowerCase()}${printFoldLines ? '' : ' hide-fold-lines'}`}
        aria-hidden="true"
      >
        <div className="print-page">
          <JcardSheet editor={editor} face="outside" printable />
        </div>
        <div className="print-page">
          <JcardSheet editor={editor} face="inside" printable />
        </div>
      </div>
    </section>
  );
}
