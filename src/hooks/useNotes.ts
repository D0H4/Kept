import { useState, useEffect, useCallback } from 'react';
import { Note, UndoRedoAction } from '../types';

const STORAGE_KEY = 'google-keep-notes';
const HISTORY_KEY = 'google-keep-history';

// API 기본 URL 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<UndoRedoAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load notes from API
  useEffect(() => {
    fetch(`${API_BASE_URL}/`)
      .then(res => res.json())
      .then((data) => {
        // Convert date strings to Date objects
        const parsedNotes = data.map((note: any) => ({
          ...note,
          id: note.id.toString(),
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
          color: note.color || 'default', // default value if color field is missing
        }));
        setNotes(parsedNotes);
      })
      .catch((error) => {
        console.error('Failed to load notes:', error);
      });
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

  // Create memo (POST /memo)
  const createNote = useCallback(async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch(`${API_BASE_URL}/memo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    const { id } = await res.json();
    const newNote: Note = {
      ...noteData,
      id: id.toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
    addToHistory({ type: 'create', note: newNote });
    return newNote;
  }, [addToHistory]);

  // Update memo (PUT /memo/:id)
  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    const updatedNote = { ...note, ...updates, updatedAt: new Date() };
    await fetch(`${API_BASE_URL}/memo/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedNote)
    });
    setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
    addToHistory({ type: 'update', note: updatedNote, previousNote: note });
  }, [addToHistory, notes]);

  // Delete memo (DELETE /memo/:id, move to trash)
  const deleteNote = useCallback(async (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    if (!noteToDelete) return;
    await fetch(`${API_BASE_URL}/memo/${id}`, { method: 'DELETE' });
    setNotes(prev => prev.filter(note => note.id !== id));
    addToHistory({ type: 'delete', note: noteToDelete });
  }, [addToHistory, notes]);

  // Load trash list
  const fetchTrash = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/trash`);
    const data = await res.json();
    return data.map((note: any) => ({
      ...note,
      id: note.id.toString(),
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
      deletedAt: note.deletedAt ? new Date(note.deletedAt) : null,
      color: note.color || 'default',
    }));
  }, []);

  // Restore memo (PATCH /memo/:id/restore)
  const restoreNote = useCallback(async (id: string) => {
    await fetch(`${API_BASE_URL}/memo/${id}/restore`, { method: 'PATCH' });
  }, []);

  // Permanently delete memos older than 7 days (DELETE /trash/permanent)
  const permanentlyDeleteOldMemos = useCallback(async () => {
    await fetch(`${API_BASE_URL}/trash/permanent`, { method: 'DELETE' });
  }, []);

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
    canRedo,
    fetchTrash,
    restoreNote,
    permanentlyDeleteOldMemos
  };
};