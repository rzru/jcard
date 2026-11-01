import { useEffect, useRef, useState } from 'react';

import {
  DEFAULT_FORMAT,
  JCARD_FORMATS,
  defaultTextStyle,
  totalWidth,
  type FreeText,
  type JcardArea,
  type JcardFace,
  type TextStyle,
} from '../model/editor-model';
import { validateImage } from '../validation/image-file';
import {
  findSelectedArea,
  findSelectedText,
  type ClipboardItem,
  type Selection,
} from './editor-selection';
import { DEFAULT_EDITOR, loadEditor, saveEditor, type StoredEditor } from './editor-storage';

type HistorySnapshot = Pick<StoredEditor, 'formatId' | 'texts' | 'areas'>;

export function useJcardEditor() {
  const [document, setDocument] = useState<StoredEditor>(() => loadEditor() ?? DEFAULT_EDITOR);
  const [selection, setSelection] = useState<Selection>();
  const [imageError, setImageError] = useState<string>();
  const [persistenceError, setPersistenceError] = useState<string>();
  const historyRef = useRef<HistorySnapshot[]>([]);
  const clipboardRef = useRef<ClipboardItem | undefined>(undefined);
  const { formatId, face, texts, areas } = document;
  const format = JCARD_FORMATS.find((item) => item.id === formatId) ?? DEFAULT_FORMAT;
  const selectedText = findSelectedText(selection, texts);
  const selectedArea = findSelectedArea(selection, areas);

  function recordHistory() {
    const history = historyRef.current;
    history.push({ formatId, texts, areas });
    if (history.length > 100) {
      history.shift();
    }
  }

  function undo() {
    const snapshot = historyRef.current.pop();
    if (snapshot === undefined) {
      return false;
    }

    setDocument((current) => ({ ...current, ...snapshot }));
    setSelection(undefined);
    return true;
  }

  function copySelection() {
    if (selectedText !== undefined) {
      clipboardRef.current = { kind: 'text', value: selectedText };
      return true;
    }
    if (selectedArea !== undefined) {
      clipboardRef.current = { kind: 'area', value: selectedArea };
      return true;
    }
    return false;
  }

  function deleteSelection() {
    if (selectedText !== undefined) {
      removeText(selectedText.id);
      return true;
    }
    if (selectedArea !== undefined) {
      removeArea(selectedArea.id);
      return true;
    }
    return false;
  }

  function paste() {
    const item = clipboardRef.current;
    if (item === undefined) {
      return false;
    }

    recordHistory();
    const id = crypto.randomUUID();
    const width = totalWidth(format);
    const x = Math.min(item.value.x + 4, Math.max(0, width - item.value.width));
    const y = Math.min(item.value.y + 4, Math.max(0, 101.6 - item.value.height));

    if (item.kind === 'text') {
      setDocument((current) => ({
        ...current,
        texts: [...current.texts, { ...item.value, id, face, x, y }],
      }));
      setSelection({ kind: 'text', id });
    } else {
      setDocument((current) => ({
        ...current,
        areas: [...current.areas, { ...item.value, id, face, x, y }],
      }));
      setSelection({ kind: 'area', id });
    }
    return true;
  }

  useEffect(() => {
    const error = saveEditor(document);
    const statusUpdate = window.setTimeout(() => setPersistenceError(error), 0);
    return () => window.clearTimeout(statusUpdate);
  }, [document]);

  function selectFace(nextFace: JcardFace) {
    setDocument((current) => ({ ...current, face: nextFace }));
    setSelection(undefined);
  }

  function setFormatId(nextFormatId: string) {
    if (nextFormatId === formatId) {
      return;
    }
    recordHistory();
    setDocument((current) => ({ ...current, formatId: nextFormatId }));
  }

  function addText() {
    recordHistory();
    const id = crypto.randomUUID();
    const text: FreeText = {
      id,
      face,
      text: 'Double-click to edit',
      x: 8,
      y: 8,
      width: 44,
      height: 10,
      rotation: 0,
      style: defaultTextStyle(),
    };
    setDocument((current) => ({ ...current, texts: [...current.texts, text] }));
    setSelection({ kind: 'text', id });
  }

  function updateText(
    id: string,
    update: Partial<Omit<FreeText, 'id' | 'face'>>,
    addToHistory = true,
  ) {
    if (addToHistory) {
      recordHistory();
    }
    setDocument((current) => ({
      ...current,
      texts: current.texts.map((text) => (text.id === id ? { ...text, ...update } : text)),
    }));
  }

  function updateTextStyle(id: string, update: Partial<TextStyle>) {
    recordHistory();
    setDocument((current) => ({
      ...current,
      texts: current.texts.map((text) =>
        text.id === id ? { ...text, style: { ...text.style, ...update } } : text,
      ),
    }));
  }

  function removeText(id: string) {
    recordHistory();
    setDocument((current) => ({
      ...current,
      texts: current.texts.filter((text) => text.id !== id),
    }));
    setSelection(undefined);
  }

  function addArea() {
    recordHistory();
    const id = crypto.randomUUID();
    const area: JcardArea = {
      id,
      face,
      x: 4,
      y: 4,
      width: Math.min(55, totalWidth(format) - 8),
      height: 28,
      fill: 'color',
      color: '#ffffff',
      imageUrl: '',
      opacity: 100,
      blur: 0,
    };
    setDocument((current) => ({ ...current, areas: [...current.areas, area] }));
    setSelection({ kind: 'area', id });
  }

  function updateArea(
    id: string,
    update: Partial<Omit<JcardArea, 'id' | 'face'>>,
    addToHistory = true,
  ) {
    if (addToHistory) {
      recordHistory();
    }
    setDocument((current) => ({
      ...current,
      areas: current.areas.map((area) => (area.id === id ? { ...area, ...update } : area)),
    }));
  }

  function chooseAreaArtwork(id: string, file: File | undefined) {
    if (file === undefined) {
      return;
    }

    const error = validateImage(file);
    if (error !== undefined) {
      setImageError(error);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        setImageError('The artwork could not be read. Choose another image.');
        return;
      }

      updateArea(id, { fill: 'image', imageUrl: reader.result });
      setImageError(undefined);
    });
    reader.addEventListener('error', () => {
      setImageError('The artwork could not be read. Choose another image.');
    });
    reader.readAsDataURL(file);
  }

  function removeArea(id: string) {
    recordHistory();
    setDocument((current) => ({
      ...current,
      areas: current.areas.filter((area) => area.id !== id),
    }));
    setSelection(undefined);
  }

  return {
    addArea,
    addText,
    areas,
    chooseAreaArtwork,
    clearSelection: () => setSelection(undefined),
    copySelection,
    deleteSelection,
    face,
    format,
    formatId,
    imageError,
    paste,
    persistenceError,
    recordHistory,
    removeArea,
    removeText,
    selectArea: (id: string) => setSelection({ kind: 'area', id }),
    selectFace,
    selectedArea,
    selectedText,
    selectText: (id: string) => setSelection({ kind: 'text', id }),
    setFormatId,
    texts,
    undo,
    updateArea,
    updateText,
    updateTextStyle,
  };
}

export type JcardEditor = ReturnType<typeof useJcardEditor>;
