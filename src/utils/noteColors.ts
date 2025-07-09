import { NoteColor } from '../types';

export const noteColors: Record<NoteColor, { bg: string; hover: string; border: string }> = {
  default: {
    bg: 'bg-white dark:bg-gray-800',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
    border: 'border-gray-200 dark:border-gray-700'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    hover: 'hover:bg-red-100 dark:hover:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800'
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
    border: 'border-orange-200 dark:border-orange-800'
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
    border: 'border-yellow-200 dark:border-yellow-800'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900/30',
    border: 'border-green-200 dark:border-green-800'
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    hover: 'hover:bg-teal-100 dark:hover:bg-teal-900/30',
    border: 'border-teal-200 dark:border-teal-800'
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
    border: 'border-purple-200 dark:border-purple-800'
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/30',
    border: 'border-pink-200 dark:border-pink-800'
  }
};

export const getColorClasses = (color: NoteColor) => {
  return noteColors[color] || noteColors.default;
};