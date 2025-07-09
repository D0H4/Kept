import React from 'react';
import { NoteColor } from '../types';
import { getColorClasses } from '../utils/noteColors';

interface ColorPickerProps {
  selectedColor: NoteColor;
  onColorChange: (color: NoteColor) => void;
  className?: string;
}

const colors: { value: NoteColor; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'teal', label: 'Teal' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' }
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {colors.map(({ value, label }) => {
        const colorClasses = getColorClasses(value);
        const isSelected = selectedColor === value;
        
        return (
          <button
            key={value}
            onClick={() => onColorChange(value)}
            className={`w-8 h-8 rounded-full border-2 ${colorClasses.bg} ${colorClasses.border} ${
              isSelected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''
            } hover:scale-110 transition-all duration-200`}
            title={label}
            aria-label={`Set note color to ${label}`}
          />
        );
      })}
    </div>
  );
};