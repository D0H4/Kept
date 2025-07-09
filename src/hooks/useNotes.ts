import { useState, useEffect, useCallback } from 'react';
import { Note, UndoRedoAction } from '../types';

const STORAGE_KEY = 'google-keep-notes';
const HISTORY_KEY = 'google-keep-history';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<UndoRedoAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error parsing notes from localStorage:', error);
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addToHistory = useCallback((action: UndoRedoAction) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(action);
      return newHistory.slice(-50); // Keep last 50 actions
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const createNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes(prev => [newNote, ...prev]);
    addToHistory({ type: 'create', note: newNote });
    return newNote;
  }, [addToHistory]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        const previousNote = { ...note };
        const updatedNote = { ...note, ...updates, updatedAt: new Date() };
        addToHistory({ type: 'update', note: updatedNote, previousNote });
        return updatedNote;
      }
      return note;
    }));
  }, [addToHistory]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => {
      const noteToDelete = prev.find(note => note.id === id);
      if (noteToDelete) {
        addToHistory({ type: 'delete', note: noteToDelete });
      }
      return prev.filter(note => note.id !== id);
    });
  }, [addToHistory]);

  const togglePin = useCallback((id: string) => {
    updateNote(id, { isPinned: !notes.find(note => note.id === id)?.isPinned });
  }, [notes, updateNote]);

  const toggleArchive = useCallback((id: string) => {
    updateNote(id, { isArchived: !notes.find(note => note.id === id)?.isArchived });
  }, [notes, updateNote]);

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const action = history[historyIndex];
      
      setNotes(prev => {
        switch (action.type) {
          case 'create':
            return prev.filter(note => note.id !== action.note.id);
          case 'delete':
            return [action.note, ...prev];
          case 'update':
            return prev.map(note => 
              note.id === action.note.id && action.previousNote ? action.previousNote : note
            );
          default:
            return prev;
        }
      });
      
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const action = history[nextIndex];
      
      setNotes(prev => {
        switch (action.type) {
          case 'create':
            return [action.note, ...prev];
          case 'delete':
            return prev.filter(note => note.id !== action.note.id);
          case 'update':
            return prev.map(note => 
              note.id === action.note.id ? action.note : note
            );
          default:
            return prev;
        }
      });
      
      setHistoryIndex(nextIndex);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  return {
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
  };
};