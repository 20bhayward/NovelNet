import React, { useState } from 'react';
import { Container, Box, Grid, GridItem } from '@chakra-ui/react';
import AdvancedSearchBar from '../../components/SearchBar/AdvancedSearchBar';
import AdvancedSearchFilters from './AdvancedSearchFilters';

interface AdvancedSearchFiltersProps {
  onSearch: (query: string) => void;
  onFilters: (filters: {
    tags: string[];
    minRating: number | null;
    status: string[] | [];
    sortOption: string;
  }) => void;
  onSort: (option: string) => void;
  filters: {
    tags: string[];
    minRating: number | null;
    status: string[] | [];
    sortOption: string;
  };
}

const AdvancedSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('relevance');
  const [filters, setFilters] = useState<{
    tags: string[];
    minRating: number | null;
    status: string[] | [];
    sortOption: string;
  }>({
    tags: [],
    minRating: null,
    status: [],
    sortOption: 'relevance',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Call your search function with the query and filters
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    setFilters((prevFilters) => ({ ...prevFilters, sortOption: option }));
    // Apply the sorting logic
  };

  const handleFilters = (updatedFilters: {
    tags: string[];
    minRating: number | null;
    status: string[] | [];
    sortOption: string;
  }) => {
    setFilters(updatedFilters);
    // Apply the filtering logic
  };

  return (
    <Container maxW="container.xl" bg="background" color="background">
      <Grid templateColumns="repeat(12, 1fr)" gap={6} bg="background">
        <GridItem colSpan={3}>
          <Box bg="section" p={4} borderRadius="md">
            <AdvancedSearchFilters
              onSearch={handleSearch}
              onFilters={handleFilters}
              onSort={handleSort}
              filters={filters}
            />
          </Box>
        </GridItem>
        <GridItem colSpan={9}>
          {/* Render the search results here */}
          {/* Pass the searchQuery, sortOption, and filters as props */}
        </GridItem>
      </Grid>
    </Container>
  );
};

export default AdvancedSearch;