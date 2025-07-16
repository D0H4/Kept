export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredNotes: Note[];
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export type NoteColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple' | 'pink';

export interface UndoRedoAction {
  type: 'create' | 'update' | 'delete';
  note: Note;
  previousNote?: Note;
}