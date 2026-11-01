import { useState, type CSSProperties } from 'react';

import { totalWidth, type JcardFace } from '../../model/editor-model';
import type { JcardEditor } from '../../state/use-jcard-editor';
import { TextObject } from './jcard-text-object';
import { TransformLayer, type AlignmentGuides } from './jcard-transform';

type SheetProps = {
  readonly editor: JcardEditor;
  readonly face: JcardFace;
  readonly printable?: boolean;
};

export function JcardSheet({ editor, face, printable = false }: SheetProps) {
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuides>({});
  const width = totalWidth(editor.format);
  const sheetStyle: CSSProperties = {
    aspectRatio: `${width} / 101.6`,
    ...(printable ? { width: `${width}mm`, height: '101.6mm' } : {}),
  };
  const foldPositions = editor.format.panelWidths
    .slice(0, -1)
    .map((_, index) =>
      editor.format.panelWidths
        .slice(0, index + 1)
        .reduce((sum, panelWidth) => sum + panelWidth, 0),
    );

  return (
    <div
      className={`jcard-sheet face-${face}${printable ? ' is-printable' : ''}`}
      style={sheetStyle}
      aria-label={`${face === 'outside' ? 'Outside' : 'Inside'} J-card preview`}
      onPointerDown={(event) => {
        if (!printable && event.target === event.currentTarget) {
          editor.clearSelection();
        }
      }}
    >
      {editor.areas
        .filter((area) => area.face === face)
        .map((area) => (
          <TransformLayer
            boundsHeight={101.6}
            boundsWidth={width}
            className="jcard-area"
            interactive={!printable}
            key={area.id}
            label="Move area"
            panelWidths={editor.format.panelWidths}
            rect={area}
            selected={!printable && editor.selectedArea?.id === area.id}
            onSelect={() => editor.selectArea(area.id)}
            onChange={(rect) => editor.updateArea(area.id, rect, false)}
            onChangeStart={editor.recordHistory}
            onGuidesChange={setAlignmentGuides}
          >
            {area.fill === 'image' ? (
              <img
                src={area.imageUrl}
                alt=""
                draggable={false}
                style={{ opacity: area.opacity / 100 }}
              />
            ) : (
              <span
                className="area-color"
                style={{ background: area.color, opacity: area.opacity / 100 }}
                aria-hidden="true"
              />
            )}
            {area.blur === 0 ? null : (
              <span
                className="area-blur"
                style={{ backdropFilter: `blur(${area.blur}px)` }}
                aria-hidden="true"
              />
            )}
          </TransformLayer>
        ))}

      {editor.texts
        .filter((text) => text.face === face)
        .map((text) => (
          <TextObject
            editor={editor}
            interactive={!printable}
            item={text}
            key={text.id}
            onGuidesChange={setAlignmentGuides}
            panelWidths={editor.format.panelWidths}
            sheetWidth={width}
          />
        ))}

      {printable || alignmentGuides.x === undefined ? null : (
        <span
          className="alignment-guide alignment-guide-vertical"
          style={{ left: `${(alignmentGuides.x / width) * 100}%` }}
          aria-hidden="true"
        />
      )}
      {printable || alignmentGuides.y === undefined ? null : (
        <span
          className="alignment-guide alignment-guide-horizontal"
          style={{ top: `${(alignmentGuides.y / 101.6) * 100}%` }}
          aria-hidden="true"
        />
      )}

      {foldPositions.map((foldPosition) => (
        <span
          className="sheet-fold-line"
          key={foldPosition}
          style={{ left: `${(foldPosition / width) * 100}%` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
