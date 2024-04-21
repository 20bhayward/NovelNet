import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './AdvancedSearchBar.css';

interface AdvancedSearchBarProps {
  onSearch: (query: string) => void;
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="advanced-search-bar d-flex align-items-center">
      <input
        type="text"
        placeholder="Search"
        className="search-input"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSearch} />
    </div>
  );
};

export default AdvancedSearchBar;