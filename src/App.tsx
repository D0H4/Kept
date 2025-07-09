import React, { useState, useCallback } from 'react';
import { Note, NoteColor } from './types';
import { useNotes } from './hooks/useNotes';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ThemeProvider } from './contexts/ThemeContext';
import { SearchProvider } from './contexts/SearchContext';
import { Header } from './components/Header';
import { NotesGrid } from './components/NotesGrid';
import { NoteEditor } from './components/NoteEditor';
import { FloatingActionButton } from './components/FloatingActionButton';

const App: React.FC = () => {
  const {
    notes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    undo,
    redo,
    canUndo,
    canRedo
  } = useNotes();

  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleCreateNote = useCallback(() => {
    const newNote = createNote({
      title: '',
      content: '',
      color: 'default',
      isPinned: false,
      isArchived: false
    });
    setEditingNote(newNote);
  }, [createNote]);

  const handleSaveNote = useCallback((note: Note) => {
    updateNote(note.id, note);
    setEditingNote(null);
  }, [updateNote]);

  const handleDeleteNote = useCallback((id: string) => {
    deleteNote(id);
    setEditingNote(null);
  }, [deleteNote]);

  const handleColorChange = useCallback((id: string, color: NoteColor) => {
    updateNote(id, { color });
  }, [updateNote]);

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setEditingNote(null);
  }, []);

  const focusSearch = useCallback(() => {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    searchInput?.focus();
  }, []);

  useKeyboardShortcuts({
    onNewNote: handleCreateNote,
    onSearch: focusSearch,
    onUndo: undo,
    onRedo: redo,
    canUndo,
    canRedo
  });

  return (
    <ThemeProvider>
      <SearchProvider notes={notes}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <NotesGrid
              notes={notes}
              searchTerm=""
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              onTogglePin={togglePin}
              onToggleArchive={toggleArchive}
              onColorChange={handleColorChange}
            />
          </main>

          <FloatingActionButton onClick={handleCreateNote} />

          {editingNote && (
            <NoteEditor
              note={editingNote}
              onSave={handleSaveNote}
              onDelete={handleDeleteNote}
              onClose={handleCloseEditor}
              onTogglePin={togglePin}
              onToggleArchive={toggleArchive}
            />
          )}
        </div>
      </SearchProvider>
    </ThemeProvider>
  );
};

export default App;