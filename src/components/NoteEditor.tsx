import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Trash2, Pin, Archive, Palette } from 'lucide-react';
import { Note, NoteColor } from '../types';
import { getColorClasses } from '../utils/noteColors';
import { ColorPicker } from './ColorPicker';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onDelete,
  onClose,
  onTogglePin,
  onToggleArchive
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState<NoteColor>(note.color as NoteColor);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const colorClasses = getColorClasses(color);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const hasChanges = title !== note.title || content !== note.content || color !== note.color;
    setHasChanges(hasChanges);
  }, [title, content, color, note]);

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title: title.trim(),
      content: content.trim(),
      color,
      updatedAt: new Date()
    };
    onSave(updatedNote);
    setHasChanges(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const adjustTextareaHeight = () => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`${colorClasses.bg} ${colorClasses.border} border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden`}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTogglePin(note.id)}
              className={`p-2 rounded-lg transition-colors ${
                note.isPinned 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              title={note.isPinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              title="Change color"
            >
              <Palette className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => onToggleArchive(note.id)}
              className={`p-2 rounded-lg transition-colors ${
                note.isArchived 
                  ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
              title={note.isArchived ? 'Unarchive note' : 'Archive note'}
            >
              <Archive className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <button
                onClick={handleSave}
                className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm font-medium"
                title="Save"
              >
                <Save className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
              title="Delete note"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              title="Close editor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Color picker */}
        {showColorPicker && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <ColorPicker
              selectedColor={color}
              onColorChange={(newColor) => {
                setColor(newColor);
                setShowColorPicker(false);
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          <input
            ref={titleRef}
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-medium bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
          />
          
          <textarea
            ref={contentRef}
            placeholder="Take a note..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              adjustTextareaHeight();
            }}
            className="w-full min-h-[200px] bg-transparent border-none outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
            style={{ height: 'auto' }}
            onInput={adjustTextareaHeight}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {hasChanges ? 'Unsaved changes' : 'All changes saved'}
          </span>
          <span>
            Last edited: {note.updatedAt.toLocaleString()}
          </span>
        </div>
      </div>

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