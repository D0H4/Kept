import React from 'react';
import { Note, NoteColor } from '../types';
import { NoteCard } from './NoteCard';

interface NotesGridProps {
  notes: Note[];
  searchTerm: string;
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onColorChange: (id: string, color: NoteColor) => void;
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  searchTerm,
  onEditNote,
  onDeleteNote,
  onTogglePin,
  onToggleArchive,
  onColorChange
}) => {
  const visibleNotes = notes.filter(note => !note.isArchived);
  const pinnedNotes = visibleNotes.filter(note => note.isPinned);
  const unpinnedNotes = visibleNotes.filter(note => !note.isPinned);

  if (visibleNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-gray-500 dark:text-gray-400">
        <h2 className="text-xl font-medium mb-2">No notes yet</h2>
        <p className="text-sm">Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
            Pinned
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                searchTerm={searchTerm}
                onEdit={onEditNote}
                onDelete={onDeleteNote}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                onColorChange={onColorChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes */}
      {unpinnedNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              Other
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                searchTerm={searchTerm}
                onEdit={onEditNote}
                onDelete={onDeleteNote}
                onTogglePin={onTogglePin}
                onToggleArchive={onToggleArchive}
                onColorChange={onColorChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};