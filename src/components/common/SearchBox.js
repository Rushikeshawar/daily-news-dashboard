 
// src/components/common/SearchBox.js
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBox = ({ 
  placeholder = 'Search...', 
  onSearch, 
  onClear,
  suggestions = [],
  showSuggestions = false,
  loading = false
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestionsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery = query) => {
    onSearch(searchQuery);
    setShowSuggestionsDropdown(false);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestionsDropdown(false);
    if (onClear) onClear();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-box" ref={inputRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestionsDropdown(showSuggestions && e.target.value.length > 0);
          }}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="form-input pl-10 pr-10"
          disabled={loading}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSuggestionsDropdown && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="search-suggestion"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;

