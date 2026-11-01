import type { JcardEditor } from '../state/use-jcard-editor';

export function isEditingText(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest('input, textarea, select, [contenteditable="true"]') !== null
  );
}

export function runEditorShortcut(event: KeyboardEvent, editor: JcardEditor) {
  if (event.key === 'Backspace') {
    return editor.deleteSelection();
  }
  if (!(event.ctrlKey || event.metaKey) || event.altKey) {
    return false;
  }

  switch (event.key.toLowerCase()) {
    case 'c':
      return editor.copySelection();
    case 'v':
      return editor.paste();
    case 'z':
      return !event.shiftKey && editor.undo();
    default:
      return false;
  }
}
