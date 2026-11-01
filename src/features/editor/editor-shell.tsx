import '@fontsource-variable/anybody/index.css';
import '@fontsource-variable/fraunces/index.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/funnel-sans/index.css';
import '@fontsource-variable/newsreader/index.css';
import '@fontsource-variable/newsreader/wght-italic.css';
import '@fontsource-variable/space-grotesk/index.css';
import '@fontsource-variable/syne/index.css';
import '@fontsource-variable/unbounded/index.css';
import '@fontsource/azeret-mono/400.css';
import '@fontsource/azeret-mono/600.css';
import '@fontsource/barlow-condensed/400-italic.css';
import '@fontsource/barlow-condensed/400.css';
import '@fontsource/barlow-condensed/700-italic.css';
import '@fontsource/barlow-condensed/700.css';
import './styles/shell.css';
import './styles/preview.css';
import './styles/print.css';

import { useEffect, useState } from 'react';

import { JcardPreview } from './components/canvas/jcard-preview';
import { PrintIcon } from './components/icons';
import { EditorInspector } from './components/inspector/editor-inspector';
import { isEditingText, runEditorShortcut } from './keyboard/editor-shortcuts';
import { useJcardEditor } from './state/use-jcard-editor';

export function EditorShell() {
  const editor = useJcardEditor();
  const [printFoldLines, setPrintFoldLines] = useState(true);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isEditingText(event.target) && runEditorShortcut(event, editor)) {
        event.preventDefault();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  return (
    <div className="editor-app">
      <header className="app-bar">
        <a className="brand" href="/" aria-label="Jcard home">
          <span className="brand-mark" aria-hidden="true">
            <i className="brand-reel brand-reel-left" />
            <i className="brand-reel brand-reel-right" />
          </span>
          <span>Jcard</span>
        </a>
        <div className="print-controls">
          <label className="print-fold-toggle">
            <input
              type="checkbox"
              checked={printFoldLines}
              onChange={(event) => setPrintFoldLines(event.currentTarget.checked)}
            />
            Fold lines
          </label>
          <button className="print-button" type="button" onClick={() => window.print()}>
            <PrintIcon />
            Print / Save PDF
          </button>
        </div>
      </header>

      <main className="editor-layout">
        <EditorInspector editor={editor} />
        <div className="editor-main">
          <JcardPreview editor={editor} printFoldLines={printFoldLines} />
        </div>
      </main>
    </div>
  );
}
