import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Box, Flex, Grid, GridItem, Heading, Image, Spinner, Text, IconButton } from '@chakra-ui/react';
import { FaStar, FaExpand } from 'react-icons/fa';
import axios from 'axios';
import AdvancedSearchBar from '../../components/SearchBar/AdvancedSearchBar';
import SearchSidebar from '../../components/SearchBar/SearchSideBar';

interface SearchResult {
  id: string;
  title: string;
  altTitles: string[];
  image: string;
  description: string;
  genres: string[];
  status: string;
  rating: number | null;
}

const Search: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedImageId, setExpandedImageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    tags: string[];
    minRating: number | null;
    status: string[] | [];
    sortOption: string;
  }>({
    tags: [],
    minRating: null,
    status: [],
    sortOption: 'rating',
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ongoing':
        return 'blue.500';
      case 'completed':
        return 'green.500';
      default:
        return 'gray.500';
    }
  };

  const imageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const searchQueryParam = new URLSearchParams(location.search).get('q');
    if (searchQueryParam) {
      setSearchQuery(searchQueryParam);
      fetchSearchResults(searchQueryParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    }
  }, [searchQuery, filters]);

  const fetchSearchResults = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: { data: { results: any[] } } = await axios.get(
        `https://consumet-api-z0sh.onrender.com/meta/anilist-manga/${encodeURIComponent(query)}`
      );

      const results: SearchResult[] = response.data.results
        .filter((result: any) => {
          const genresLowerCase = result.genres.map((genre: string) => genre.toLowerCase());
          const shouldFilterGenres =
            filters.tags.length > 0 &&
            filters.tags.some((tag) => {
              if (tag.startsWith('!')) {
                return genresLowerCase.includes(tag.slice(1));
              } else if (tag.startsWith('?')) {
                return !genresLowerCase.includes(tag.slice(1));
              } else {
                return !genresLowerCase.includes(tag);
              }
            });
          const shouldFilterRating = filters.minRating && result.rating < filters.minRating;
          const shouldFilterStatus =
            filters.status.length > 0 &&
            !filters.status.some((status) => status.toLowerCase() === result.status.toLowerCase());
          return (
            !genresLowerCase.includes('hentai') &&
            !genresLowerCase.includes('ecchi') &&
            !shouldFilterGenres &&
            !shouldFilterRating &&
            !shouldFilterStatus
          );
        })
        .map((result: any) => ({
          id: result.id,
          title: result.title.userPreferred,
          altTitles: [result.title.romaji, result.title.english, result.title.native].filter(Boolean),
          image: result.image,
          description: result.description || '',
          genres: result.genres,
          status: result.status,
          rating: result.rating,
        }));

      const sortedResults = sortSearchResults(results);
      setSearchResults(sortedResults);
    } catch (error) {
      setError('An error occurred while fetching search results.');
      console.error('Error fetching search results:', error);
    }

    setIsLoading(false);
  };

  const sortSearchResults = (results: SearchResult[]) => {
    const { sortOption } = filters;
    switch (sortOption) {
      case 'alphabetical':
        return results.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/manga/${id}`);
  };

  const handleImageExpand = (id: string | null) => {
    setExpandedImageId(id);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      handleImageExpand(null);
    }
  };

  const getScoreColor = (rating: number | null) => {
    if (rating === null) return 'gray.500';
    if (rating >= 90) return 'gold';
    if (rating < 50) return 'gray.500';
    if (rating < 60) return 'red.500';
    if (rating < 70) return 'orange.500';
    if (rating < 80) return 'yellow.500';
    if (rating < 90) return 'green.500';
  };

  const getScoreIcon = (rating: number | null) => {
    if (rating === null) return 'N/A';
    if (rating >= 90) return '✓ RECOMMENDED';
    return rating;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (option: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, sortOption: option }));
  };

  return (
    <Box bg="background" minH="100vh" p={8}>
      <Grid templateColumns={['1fr', '1fr', '1fr 3fr']} gap={8}>
        <GridItem>
          <Box position="sticky" top={8}>
            <SearchSidebar
              onSearch={handleSearch}
              onFilters={setFilters}
              onSort={handleSort}
              filters={filters}
              sortOption={filters.sortOption}
            />
          </Box>
        </GridItem>
        <GridItem>
          <Heading as="h1" size="2xl" mb={8} color="heading">
            Results for {searchQuery}
          </Heading>
          {isLoading ? (
            <Box bg="background" minH="100vh" display="flex" justifyContent="center" alignItems="center">
                <Spinner size="xl" color="blue.500" />
            </Box>
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : searchResults.length > 0 ? (
            <Grid templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={8}>
              {searchResults.map((result) => (
                <GridItem key={result.id}>
                  <Box
                    bg="subbackground"
                    borderRadius="md"
                    boxShadow="md"
                    overflow="hidden"
                    position="relative"
                    cursor="pointer"
                    transition="transform 0.2s"
                    _hover={{ transform: 'scale(1.05)' }}
                    h="100%"
                    display="flex"
                    flexDirection="column"
                    onClick={() => handleViewDetails(result.id)}
                  >
                    <Box position="relative">
                      <Image src={result.image} alt={result.title} objectFit="cover" flexGrow={1} />
                      <IconButton
                        aria-label="Expand"
                        icon={<FaExpand />}
                        position="absolute"
                        top={2}
                        right={2}
                        size="sm"
                        variant="solid"
                        colorScheme="green"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageExpand(result.id);
                        }}
                      />
                    </Box>
                    <Box p={4} flexGrow={0}>
                      <Heading as="h3" size="md" color="white" mb={2}>
                        {result.title}
                      </Heading>
                      <Flex align="center" mb={2}>
                        <Badge
                          borderRadius="full"
                          px={3}
                          py={1}
                          mr={2}
                          bg={getScoreColor(result.rating)}
                        >
                          {getScoreIcon(result.rating)}
                        </Badge>
                        <Badge borderRadius="full" px={3} py={1} color={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </Flex>
                      <Text color="text" noOfLines={result.genres.length > 0 ? 2 : 4}>
                        {result.description}
                      </Text>
                      {result.genres.length > 0 && (
                        <Text color="subheading" mt={2}>
                          Genres: {result.genres.join(', ')}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          ) : (
            <Text color="text">No search results found.</Text>
          )}
          {expandedImageId && (
            <Box
              position="fixed"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="rgba(0, 0, 0, 0.8)"
              zIndex="9999"
              display="flex"
              justifyContent="center"
              alignItems="center"
              onClick={handleOverlayClick}
            >
              <Box position="relative">
                <Image
                  src={searchResults.find((result) => result.id === expandedImageId)?.image}
                  alt={searchResults.find((result) => result.id === expandedImageId)?.title}
                  maxW="90%"
                  maxH="90%"
                />
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  bg="rgba(0, 0, 0, 0.7)"
                  color="white"
                  px={4}
                  py={2}
                  cursor="pointer"
                  onClick={() => handleImageExpand(null)}
                >
                  X
                </Box>
              </Box>
            </Box>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Search;