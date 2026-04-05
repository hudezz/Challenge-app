'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchFilterProps {
  onSearch: (month: string) => Promise<void>;
  onClear: () => void;
  isSearching?: boolean;
}

export function SearchFilter({ onSearch, onClear, isSearching = false }: SearchFilterProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback(async () => {
    if (query.trim()) {
      await onSearch(query.trim());
    }
  }, [query, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setQuery('');
      onClear();
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-md"
    >
      {/* Glow effect when focused */}
      <div
        className={cn(
          'absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl opacity-0 blur-lg transition-opacity duration-300',
          isFocused && 'opacity-40'
        )}
      />
      
      <div className="relative flex items-center">
        <div className="absolute left-3 z-10">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search by month (e.g., January)..."
          className={cn(
            'pl-10 pr-10 h-12 bg-card/60 backdrop-blur-xl border-border/50',
            'focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20',
            'placeholder:text-muted-foreground/60 rounded-xl transition-all duration-300'
          )}
        />
        
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-md hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        )}
      </div>
      
      {/* Hint text */}
      <p className="mt-2 text-xs text-muted-foreground/60 pl-1">
        Press Enter to search, Escape to clear
      </p>
    </motion.div>
  );
}
