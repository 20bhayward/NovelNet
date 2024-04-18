import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Overlay } from 'react-bootstrap';
import axios from 'axios';
import './Search.css';

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

  const imageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get('q');
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    }
  }, [location.search]);

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
          return !genresLowerCase.includes('hentai') && !genresLowerCase.includes('ecchi');
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
  
      setSearchResults(results);
    } catch (error) {
      setError('An error occurred while fetching search results.');
      console.error('Error fetching search results:', error);
    }
  
    setIsLoading(false);
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
    if (rating === null) return 'black';
    if (rating >= 90) return 'gold';
    if (rating < 50) return 'black';
    if (rating < 60) return 'red';
    if (rating < 70) return 'orange';
    if (rating < 80) return 'yellow';
    if (rating < 90) return 'green';
  };

  const getScoreIcon = (rating: number | null) => {
    if (rating === null) return 'N/A';
    if (rating >= 90) return '✓ RECOMMENDED';
    return rating;
  };

  const sortedSearchResults = searchResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <Container>
      <h1>Search Results</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : searchResults.length > 0 ? (
        <Row>
          {sortedSearchResults.map((result) => (
            <Col lg={4} key={result.id}>
              <Card className="search-card">
                <div
                  ref={(node) => (imageRefs.current[result.id] = node)}
                  className="search-card-image-container"
                  onClick={() => handleImageExpand(result.id)}
                >
                  <Image src={result.image} alt={result.title} className="search-card-image" />
                  <div
                    className="search-card-title-panel"
                    onClick={() => handleViewDetails(result.id)}
                  >
                    <Card.Title>{result.title}</Card.Title>
                  </div>
                </div>
                <Card.Body>
                  <div className="search-card-info">
                    <div className="search-card-score">
                      <span
                        className={`score-circle ${getScoreColor(result.rating)}`}
                        style={{
                          boxShadow:
                            result.rating && result.rating >= 90
                              ? '0 0 10px rgba(255, 215, 0, 0.8)'
                              : 'none',
                        }}
                      >
                        {getScoreIcon(result.rating)}
                      </span>
                    </div>
                    <div className="search-card-details">
                      <Card.Text className="search-card-description">
                        {result.description.length > 100
                          ? `${result.description.slice(0, 100)}...`
                          : result.description}
                      </Card.Text>
                      <Card.Text className="search-card-genres">Genres: {result.genres.join(', ')}</Card.Text>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No search results found.</p>
      )}
      {expandedImageId && (
        <div className="expanded-image-overlay" onClick={handleOverlayClick}>
          <div className="expanded-image-container">
            <Image
              src={searchResults.find((result) => result.id === expandedImageId)?.image}
              alt={searchResults.find((result) => result.id === expandedImageId)?.title}
              className="expanded-image"
            />
            <button className="close-button" onClick={() => handleImageExpand(null)}>
              X
            </button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Search;