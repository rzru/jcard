import { JCARD_FORMATS } from '../../model/editor-model';
import type { JcardEditor } from '../../state/use-jcard-editor';
import { EditorDock } from './editor-dock';

import styles from '../../styles/inspector.module.css';

export function EditorInspector({ editor }: { readonly editor: JcardEditor }) {
  return (
    <aside
      className={styles['editor-inspector']}
      data-editor-inspector
      aria-label="J-card settings"
    >
      <details open>
        <summary>Format</summary>
        <div className={styles['section-body']}>
          <div className={styles['format-options']} role="radiogroup" aria-label="Cassette format">
            {JCARD_FORMATS.map((format) => (
              <label key={format.id} className={styles['format-option']}>
                <input
                  className={styles['format-radio']}
                  type="radio"
                  name="format"
                  value={format.id}
                  checked={editor.formatId === format.id}
                  onChange={() => editor.setFormatId(format.id)}
                />
                <span>
                  <strong>{format.label}</strong>
                  <small>{format.description}</small>
                </span>
                <span className={styles['paper-badge']}>{format.paper}</span>
              </label>
            ))}
          </div>
        </div>
      </details>
      <EditorDock editor={editor} />
    </aside>
  );
}
