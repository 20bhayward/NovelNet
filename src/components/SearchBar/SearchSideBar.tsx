import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

interface SearchSidebarProps {
  onSearch: (query: string) => void;
  onSort: (option: string) => void;
  onFilters: (filters: any) => void;
  sortOption: string;
  filters: any;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({
  onSearch,
  onSort,
  onFilters,
  sortOption,
  filters,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [statuses, setStatuses] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSort(e.target.value);
  };

  const handleTagsChange = (tag: string) => {
    if (tags.includes(tag)) {
      // Tag already exists, remove it
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.includes(`!${tag}`)) {
      // Negated tag exists, replace it with the positive tag
      setTags(tags.filter((t) => t !== `!${tag}`).concat(tag));
    } else if (tags.includes(`?${tag}`)) {
      // Optional tag exists, replace it with the negated tag
      setTags(tags.filter((t) => t !== `?${tag}`).concat(`!${tag}`));
    } else {
      // Add the optional tag
      setTags([...tags, `?${tag}`]);
    }
    onFilters({ ...filters, tags });
  };

  const handleMinRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    setMinRating(value);
    onFilters({ ...filters, minRating: value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const status = e.target.value;
    if (e.target.checked) {
      setStatuses([...statuses, status]);
    } else {
      setStatuses(statuses.filter((s) => s !== status));
    }
    onFilters({ ...filters, status: statuses });
  };

  return (
    <div className="sidebar">
      <Form onSubmit={handleSearchSubmit}>
        <Form.Group controlId="searchInput">
          <Form.Label style={{ color: "white" }}>Search</Form.Label>
          <Form.Control
            type="text"
            color="white"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter search term"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>

      <Form.Group controlId="sortOptions">
        <Form.Label style={{ color: "white" }}>Sort By</Form.Label>
        <Form.Control as="select" value={sortOption} onChange={handleSortChange}>
          <option value="alphabetical">Alphabetical</option>
          <option value="rating">Rating</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="tagsFilter">
        <Form.Label style={{color: "white"}}>Tags</Form.Label>
        {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'].map((tag) => (
          <Form.Check
            style={{ color: "white" }}
            key={tag}
            type="checkbox"
            label={tag}
            value={tag.toLowerCase()}
            checked={tags.includes(tag.toLowerCase()) || tags.includes(`!${tag.toLowerCase()}`)}
            onChange={() => handleTagsChange(tag.toLowerCase())}
          />
        ))}
      </Form.Group>

      <Form.Group controlId="ratingFilter">
        <Form.Label style={{ color: "white" }}>Minimum Rating</Form.Label>
        <Form.Control
          type="number"
          value={minRating || ''}
          onChange={handleMinRatingChange}
          min={0}
          max={100}
        />
      </Form.Group>

      <Form.Group controlId="statusFilter">
        <Form.Label style={{ color: "white" }}>Status</Form.Label>
        <Form.Check
          style={{ color: "white" }}
          type="checkbox"
          label="Ongoing"
          value="ongoing"
          checked={statuses.includes('ongoing')}
          onChange={handleStatusChange}
        />
        <Form.Check
          style={{ color: "white" }}
          type="checkbox"
          label="Completed"
          value="completed"
          checked={statuses.includes('completed')}
          onChange={handleStatusChange}
        />
      </Form.Group>
    </div>
  );
};

export default SearchSidebar;