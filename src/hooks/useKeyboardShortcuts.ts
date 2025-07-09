import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onNewNote: () => void;
  onSearch: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useKeyboardShortcuts = ({
  onNewNote,
  onSearch,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

      if (cmdOrCtrl) {
        switch (event.key) {
          case 'k':
          case 'K':
            event.preventDefault();
            onSearch();
            break;
          case 'n':
          case 'N':
            event.preventDefault();
            onNewNote();
            break;
          case 'z':
          case 'Z':
            if (event.shiftKey && canRedo) {
              event.preventDefault();
              onRedo();
            } else if (!event.shiftKey && canUndo) {
              event.preventDefault();
              onUndo();
            }
            break;
          case 'y':
          case 'Y':
            if (canRedo) {
              event.preventDefault();
              onRedo();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNewNote, onSearch, onUndo, onRedo, canUndo, canRedo]);
};