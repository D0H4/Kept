import React, { useState } from 'react';
import { MoreVertical, Pin, Archive, Trash2, Edit3, Palette } from 'lucide-react';
import { Note, NoteColor } from '../types';
import { getColorClasses } from '../utils/noteColors';
import { ColorPicker } from './ColorPicker';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onColorChange: (id: string, color: NoteColor) => void;
  searchTerm?: string;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onColorChange,
  searchTerm = ''
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const colorClasses = getColorClasses(note.color as NoteColor);

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="group relative">
      <div
        className={`relative ${colorClasses.bg} ${colorClasses.hover} ${colorClasses.border} border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md`}
        onClick={() => onEdit(note)}
      >
        {/* Pin indicator */}
        {note.isPinned && (
          <div className="absolute top-2 right-2">
            <Pin className="h-4 w-4 text-gray-500 dark:text-gray-400 fill-current" />
          </div>
        )}

        {/* Note content */}
        <div className="space-y-3">
          {note.title && (
            <h3 
              className="font-medium text-gray-900 dark:text-white line-clamp-3"
              dangerouslySetInnerHTML={{ __html: highlightText(note.title, searchTerm) }}
            />
          )}
          
          {note.content && (
            <p 
              className="text-gray-600 dark:text-gray-300 text-sm line-clamp-6"
              dangerouslySetInnerHTML={{ __html: highlightText(note.content, searchTerm) }}
            />
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{formatDate(note.updatedAt)}</span>
          </div>
        </div>

        {/* Hover actions */}
        <div className="absolute bottom-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Change color"
          >
            <Palette className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="More options"
          >
            <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Color picker dropdown */}
      {showColorPicker && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
          <ColorPicker
            selectedColor={note.color as NoteColor}
            onColorChange={(color) => {
              onColorChange(note.id, color);
              setShowColorPicker(false);
            }}
          />
        </div>
      )}

      {/* Menu dropdown */}
      {showMenu && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
          <div className="py-1">
            <button
              onClick={() => {
                onEdit(note);
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </button>
            
            <button
              onClick={() => {
                onTogglePin(note.id);
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Pin className="h-4 w-4 mr-2" />
              {note.isPinned ? 'Unpin' : 'Pin'}
            </button>
            
            <button
              onClick={() => {
                onToggleArchive(note.id);
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Archive className="h-4 w-4 mr-2" />
              {note.isArchived ? 'Unarchive' : 'Archive'}
            </button>
            
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={() => {
          onDelete(note.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
        noteTitle={note.title || 'Untitled note'}
      />
    </div>
  );
};