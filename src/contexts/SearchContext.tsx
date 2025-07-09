import React, { createContext, useContext, useState, useMemo } from 'react';
import { SearchContextType, Note } from '../types';

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode; notes: Note[] }> = ({ children, notes }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return notes;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseSearch) ||
      note.content.toLowerCase().includes(lowercaseSearch)
    );
  }, [notes, searchTerm]);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, filteredNotes }}>
      {children}
    </SearchContext.Provider>
  );
};