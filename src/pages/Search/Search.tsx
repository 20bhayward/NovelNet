import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type Novel = {
    id: number;
    title: String;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Send search request to the API and update searchResults state
  };

  return (
    <div>
      <h1>Search Novels</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter keywords, genres, tags..."
        />
        <button type="submit">Search</button>
      </form>
      <section>
        <h2>Search Results</h2>
        {/* Display search results as a list or grid */}
        {searchResults.map((novel : Novel) => (
          <div key={novel.id}>
            <Link to={`/novel/${novel.id}`}>{novel.title}</Link>
            {/* Display novel information */}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Search;