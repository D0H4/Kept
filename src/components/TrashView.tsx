import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Note } from '../types';
import { NoteCard } from './NoteCard';

interface TrashViewProps {
  onBack: () => void;
  onRestore: (id: string) => void;
  onPermanentlyDelete: (id: string) => void;
  fetchTrash: () => Promise<Note[]>;
}

export const TrashView: React.FC<TrashViewProps> = ({
  onBack,
  onRestore,
  onPermanentlyDelete,
  fetchTrash
}) => {
  const [trashNotes, setTrashNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrash();
  }, []);

  const loadTrash = async () => {
    try {
      const notes = await fetchTrash();
      setTrashNotes(notes);
    } catch (error) {
      console.error('Failed to load trash:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await onRestore(id);
      setTrashNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error('Failed to restore memo:', error);
    }
  };

  const handlePermanentlyDelete = async (id: string) => {
    try {
      await onPermanentlyDelete(id);
      setTrashNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error('Failed to permanently delete memo:', error);
    }
  };

  const getDaysUntilPermanentDeletion = (deletedAt: Date) => {
    const now = new Date();
    const deletedDate = new Date(deletedAt);
    const diffTime = now.getTime() - deletedDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - diffDays);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-gray-500 dark:text-gray-400">Loading trash...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Trash2 className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Trash
            </h1>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {trashNotes.length} notes
        </div>
      </div>

      {/* Empty state */}
      {trashNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
          <Trash2 className="h-16 w-16 mb-4 opacity-50" />
          <h2 className="text-xl font-medium mb-2">Trash is empty</h2>
          <p className="text-sm">Deleted notes will appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Notes in trash are permanently deleted after 7 days</p>
                <p>To restore, select a note and click the "Restore" button</p>
              </div>
            </div>
          </div>

          {/* Trash notes grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {trashNotes.map((note) => (
              <div key={note.id} className="relative group">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                  {/* Note content */}
                  <div className="mb-3">
                    {note.title && (
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {note.title}
                      </h3>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                      {note.content}
                    </p>
                  </div>

                  {/* Deletion info */}
                  {note.deletedAt && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Deleted: {note.deletedAt.toLocaleDateString()}
                      <br />
                      {getDaysUntilPermanentDeletion(note.deletedAt)} days until permanent deletion
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleRestore(note.id)}
                      className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => handlePermanentlyDelete(note.id)}
                      className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 