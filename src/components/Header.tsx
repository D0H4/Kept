import React from 'react';
import { Search, Undo2, Redo2, Trash2 } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenTrash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenTrash
}) => {
  const { searchTerm, setSearchTerm } = useSearch();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - Left */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Kept</h1>
        </div>
        
        {/* Search - Center */}
        <div className="relative flex-1 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search your notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        {/* Actions - Right */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-5 w-5" />
          </button>
          
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-5 w-5" />
          </button>

          {onOpenTrash && (
            <button
              onClick={onOpenTrash}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="휴지통"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
          
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};