import { RECT_FIELDS } from '../../model/editor-controls';
import type { CanvasRect } from '../../model/editor-model';

export function BoundsEditor({
  rect,
  onChange,
}: {
  readonly rect: CanvasRect;
  readonly onChange: (update: Partial<CanvasRect>) => void;
}) {
  return (
    <fieldset className="boundary-tools">
      <legend>Bounds · mm</legend>
      {RECT_FIELDS.map(({ field, label }) => (
        <label key={field}>
          <span>{label}</span>
          <input
            type="number"
            min={field === 'width' || field === 'height' ? 2 : 0}
            step="0.5"
            value={Number(rect[field].toFixed(1))}
            onChange={(event) => onChange({ [field]: event.currentTarget.valueAsNumber })}
          />
        </label>
      ))}
    </fieldset>
  );
}
