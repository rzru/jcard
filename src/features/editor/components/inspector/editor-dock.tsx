import type { JcardEditor } from '../../state/use-jcard-editor';
import { AreaTools } from './area-tools';
import { TextTools } from './text-tools';

import styles from '../../styles/inspector.module.css';

export function EditorDock({ editor }: { readonly editor: JcardEditor }) {
  return (
    <section className="editor-dock" aria-label="Editing tools">
      {editor.persistenceError === undefined ? null : (
        <p className={`${styles['field-error']} dock-save-error`} role="alert">
          {editor.persistenceError}
        </p>
      )}

      {editor.selectedText === undefined && editor.selectedArea === undefined ? (
        <div className="dock-panel dock-empty-actions">
          <button className="add-text" type="button" onClick={editor.addText}>
            Add text
          </button>
          <button className="add-text add-area" type="button" onClick={editor.addArea}>
            Add area
          </button>
        </div>
      ) : null}

      {editor.selectedText === undefined ? null : (
        <TextTools editor={editor} text={editor.selectedText} />
      )}
      {editor.selectedArea === undefined ? null : (
        <AreaTools area={editor.selectedArea} editor={editor} />
      )}
    </section>
  );
}
