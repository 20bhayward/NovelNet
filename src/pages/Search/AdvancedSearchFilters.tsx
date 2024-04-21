import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Select, Checkbox, Button } from '@chakra-ui/react';


interface AdvancedSearchFiltersProps {
  onSearch: (query: string) => void;
  onFilters: (filters: {
    tags: string[];
    minRating: number | null;
    status: string[];
    sortOption: string;
  }) => void;
  onSort: (option: string) => void;
  filters: {
    tags: string[];
    minRating: number | null;
    status: string[];
    sortOption: string;
  };
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  onSearch,
  onFilters,
  onSort,
  filters,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState<string[]>(filters.tags);
  const [minRating, setMinRating] = useState<number | null>(filters.minRating);
  const [statuses, setStatuses] = useState<string[]>(filters.status);
  const [sortOption, setSortOption] = useState<string>(filters.sortOption);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
    onSort(option);
    onFilters({ ...filters, sortOption: option });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value;
    if (e.target.checked) {
      setTags([...tags, tag]);
    } else {
      setTags(tags.filter((t) => t !== tag));
    }
    onFilters({ ...filters, tags: [...tags, tag] });
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
    onFilters({ ...filters, status: [...statuses, status] });
  };

  const genres = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mahou Shoujo',
    'Mecha',
    'Music',
    'Mystery',
    'Psychological',
    'Romance',
    'Sci-Fi',
    'Slice of Life',
    'Sports',
    'Supernatural',
    'Thriller',
  ];

  return (
    <Box>
      <form onSubmit={handleSearchSubmit}>
        <FormControl id="searchInput" mb={4}>
          <FormLabel>Search</FormLabel>
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter search term"
            bg="subbackground"
            color="heading"
            borderColor="button"
            _focus={{ borderColor: 'button', boxShadow: 'none' }}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Search
        </Button>
      </form>
  
      <FormControl id="sortOptions" mb={4}>
        <FormLabel>Sort By</FormLabel>
        <Select
          value={sortOption}
          onChange={handleSortChange}
          bg="subbackground"
          color="heading"
          borderColor="button"
          _focus={{ borderColor: 'button', boxShadow: 'none' }}
        >
          <option color='black' value="relevance">Relevance</option>
          <option color='black'value="alphabetical">Alphabetical</option>
          <option color='black' value="rating">Rating</option>
          <option color='black' value="popularity">Popularity</option>
        </Select>
      </FormControl>
  
      <FormControl id="tagsFilter" mb={4}>
        <FormLabel>Tags</FormLabel>
        {genres.map((genre) => (
          <Checkbox
            key={genre}
            value={genre.toLowerCase()}
            isChecked={tags.includes(genre.toLowerCase())}
            onChange={handleTagsChange}
            colorScheme="blue"
            color="heading"
            mr={1}
          >
            {genre}
          </Checkbox>
        ))}
      </FormControl>
  
      <FormControl id="ratingFilter" mb={4}>
        <FormLabel>Minimum Rating</FormLabel>
        <Input
          type="number"
          value={minRating || ''}
          onChange={handleMinRatingChange}
          min={0}
          max={100}
          bg="subbackground"
          color="heading"
          borderColor="button"
          _focus={{ borderColor: 'button', boxShadow: 'none' }}
        />
      </FormControl>
  
      <FormControl id="statusFilter">
        <FormLabel>Status</FormLabel>
        <Checkbox
          value="ongoing"
          isChecked={statuses.includes('ongoing')}
          onChange={handleStatusChange}
          colorScheme="blue"
          color="heading"
        >
          Ongoing
        </Checkbox>
        <Checkbox
          value="completed"
          isChecked={statuses.includes('completed')}
          onChange={handleStatusChange}
          colorScheme="blue"
          color="heading"
        >
          Completed
        </Checkbox>
      </FormControl>
    </Box>
  );
};

export default AdvancedSearchFilters;