import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import axios from 'axios';
import { FaStar, FaHeart, FaEye, FaArrowLeft, FaRegHeart, FaBook, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import {
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    Image,
    Spinner,
    Text,
    Textarea,
    Badge,
} from '@chakra-ui/react';

interface MangaDetails {
    id: string;
    title: {
        romaji: string;
        english: string;
        native: string;
    };
    altTitles: string[];
    malId?: number;
    trailer?: {
        id: string;
        site: string;
        thumbnail: string;
    };
    image?: string;
    popularity?: number;
    color?: string;
    description?: string;
    status?: string;
    releaseDate?: number;
    startDate?: {
        year: number;
        month: number;
        day: number;
    };
    endDate?: {
        year: number;
        month: number;
        day: number;
    };
    rating?: number;
    genres?: string[];
    season?: string;
    studios?: string[];
    type?: string;
    recommendations?: {
        id: string;
        malId: string;
        title: string[];
        status: string;
        chapters: number;
        image: string;
        cover: string;
        rating: number;
        type: string;
    }[];
    characters?: {
        id: string;
        role: string;
        name: string[];
        image: string;
    }[];
    relations?: {
        id: number;
        relationType: string;
        malId: number;
        title: string[];
        status: string;
        chapters: number;
        image: string;
        color: string;
        type: string;
        cover: string;
        rating: number;
    }[];
    chapters?: {
        id: string;
        title: string;
        chapter: string;
    }[];
}


interface Review {
    uniqueId: string;
    username: string;
    rating: number;
    comment: string;
    mangaId: string;
}

interface GenreColorMap {
    [key: string]: string;
}

const MangaDetails: React.FC = () => {
    const { mangaId } = useParams<{ mangaId: any }>();
    const [mangaDetails, setMangaDetails] = useState<MangaDetails | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isReading, setIsReading] = useState(false);

    const API_BASE_URL = 'https://consumet-api-z0sh.onrender.com/meta/anilist/';
    const DB_BASE_URL = process.env.NODE_URL || 'https://lorelibraryserver.onrender.com';

    const genreColor: GenreColorMap = {
        'Action': '#e74c3c',
        'Adventure': '#f1c40f',
        'Comedy': '#2ecc71',
        'Drama': '#9b59b6',
        'Fantasy': '#3498db',
        'Horror': '#e67e22',
        'Mahou Shoujo': '#e91e63',
        'Mecha': '#8e44ad',
        'Music': '#16a085',
        'Mystery': '#1abc9c',
        'Psychological': '#2c3e50',
        'Romance': '#e91e63',
        'Sci-Fi': '#8e44ad',
        'Slice of Life': '#2c3e50',
        'Sports': '#16a085',
        'Supernatural': '#d35400',
        'Thriller': '#c0392b'
    };

    useEffect(() => {
        const fetchMangaDetails = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${API_BASE_URL}info/${mangaId}?provider=mangareader`);
                setMangaDetails(response.data);

                // Fetch reviews from the MongoDB database
                const reviewsData: Review[] = await fetchReviews(mangaId);
                setReviews(reviewsData);
            } catch (error) {
                setError('An error occurred while fetching manga details.');
                console.error('Error fetching manga details:', error);
            }

            setIsLoading(false);
        };
        const fetchUserManga = async () => {
            try {
                const response = await api.get(`/api/users/${user?._id}/manga`);
                const { followedManga, favoriteManga, readingManga } = response.data;
                setIsFollowing(followedManga.includes(mangaId));
                setIsFavorite(favoriteManga.includes(mangaId));
                setIsReading(readingManga.includes(mangaId));
            } catch (error) {
                console.error('Error fetching user manga:', error);
            }
        };
        if (mangaId) {
            fetchMangaDetails();
        }

        if (user && mangaId) {
            fetchUserManga();
        }
    }, [user, mangaId]);

    const fetchReviews = async (mangaId: string): Promise<Review[]> => {
        try {
            const response = await api.get(`/api/manga/${mangaId}/reviews`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            alert('You must be logged in to leave a comment.');
            return;
        }

        try {
            const newReview: Review = {
                uniqueId: user?._id || '',
                username: user?.username || '',
                rating: newRating,
                comment: newComment,
                mangaId: mangaId!,
            };

            await api.post(`/api/manga/${mangaId}/reviews`, newReview);
            const updatedReviews = await fetchReviews(mangaId!);
            setReviews(updatedReviews);
            setNewComment('');
            setNewRating(0);
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit the review. Please try again.');
        }
    };

    const handleViewProfile = (_id: string) => {
        if (user) {
            navigate(`/profile/${_id}`);
        } else {
            // Handle the case when the user object is not available
            navigate('/default-profile');
        }
    }

    const handleFollow = async () => {
        if (user && user._id && mangaDetails) {
            try {
                setIsFollowing(!isFollowing);
                if (isFollowing) {
                    await api.post(`/api/users/${user._id}/unfollow/${mangaId}`);
                } else {
                    await api.post(`/api/users/${user._id}/follow/${mangaId}`, mangaDetails);
                }

            } catch (error) {
                console.error('Error toggling follow:', error);
            }
        } else {
            console.error('User not authenticated, user ID not available, or manga details not loaded');
        }
    };

    // Similar changes for handleFavorite and handleReading functions

    const handleFavorite = async () => {
        if (user && user._id && mangaDetails) {
            try {
                setIsFavorite(!isFavorite);
                if (isFavorite) {
                    await api.post(`/api/users/${user._id}/unfavorite/${mangaId}`);
                } else {
                    await api.post(`/api/users/${user._id}/favorite/${mangaId}`, mangaDetails);
                }

            } catch (error) {
                console.error('Error toggling favorite:', error);
            }
        } else {
            console.error('User not authenticated, user ID not available, or manga details not loaded');
        }
    };

    const handleReading = async () => {
        if (user && user._id && mangaDetails) {
            try {
                setIsReading(!isReading);
                if (isReading) {
                    await api.post(`/api/users/${user._id}/unreading/${mangaId}`);
                } else {
                    await api.post(`/api/users/${user._id}/reading/${mangaId}`, mangaDetails);
                }

            } catch (error) {
                console.error('Error toggling reading:', error);
            }
        } else {
            console.error('User not authenticated, user ID not available, or manga details not loaded');
        }
    };

    if (isLoading) {
        return (
            <Box bg="background" minH="100vh" display="flex" justifyContent="center" alignItems="center">
                <Spinner size="xl" color="blue.500" />
            </Box>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!mangaDetails) {
        return <div className="error-message">No manga details found.</div>;
    }


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

    return (
        <Box bg="background" minH="100vh" py={8}>
            <Grid templateColumns={['1fr', '1fr', '1fr 2fr']} gap={8} maxW="1200px" mx="auto">
                <Box>
                    {mangaDetails.image && (
                        <Image
                            src={mangaDetails.image}
                            alt={mangaDetails.title.romaji}
                            borderRadius="md"
                            boxShadow="md"
                            w="100%"
                            h="auto"
                        />
                    )}
                    {isAuthenticated && (
                        <Box bg="subbackground" p={4} mt={4} borderRadius="md">
                            <Flex justify="center">
                                <Button
                                    colorScheme={isFollowing ? 'green' : 'orange'}
                                    mr={4}
                                    onClick={handleFollow}
                                    leftIcon={isFollowing ? <FaBookmark /> : <FaRegBookmark />}
                                    width="120px"
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Button>
                                <Button
                                    colorScheme={isFavorite ? 'pink' : 'red'}
                                    mr={4}
                                    onClick={handleFavorite}
                                    leftIcon={isFavorite ? <FaHeart /> : <FaRegHeart />}
                                    width="120px"
                                >
                                    {isFavorite ? 'Favorited' : 'Favorite'}
                                </Button>
                                <Button
                                    colorScheme={isReading ? 'gray' : 'green'}
                                    onClick={handleReading}
                                    leftIcon={<FaBook />}
                                    width="120px"
                                >
                                    {isReading ? 'Drop' : 'Read'}
                                </Button>
                            </Flex>
                        </Box>
                    )}
                </Box>
                <Box>
                    <Heading as="h1" size="2xl" mb={4} color="heading">
                        {mangaDetails.title.romaji || mangaDetails.title.english || mangaDetails.title.native}
                    </Heading>
                    {mangaDetails.altTitles && mangaDetails.altTitles.length > 0 && (
                        <Text fontSize="xl" mb={4} color="gray.400">
                            Also known as:{' '}
                            {mangaDetails.altTitles.map((altTitle, index) => (
                                <span key={index} style={{ fontStyle: 'italic' }}>
                                    {altTitle}
                                    {index !== mangaDetails.altTitles.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </Text>
                    )}
                    {mangaDetails.description && (
                        <Text fontSize="lg" mb={6} color="gray.300">
                            <div dangerouslySetInnerHTML={{ __html: mangaDetails.description }} />
                        </Text>
                    )}
                    <Flex direction="column" mb={6}>
                        {mangaDetails.rating && (
                            <Flex align="center" mb={2}>
                                <Badge bg="subbackground" color="text" mr={2}>Rating: </Badge>
                                <Badge
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                    mr={2}
                                    bg={getScoreColor(mangaDetails.rating)}
                                >
                                    {getScoreIcon(mangaDetails.rating)}
                                </Badge>
                            </Flex>
                        )}
                        {mangaDetails.popularity && (
                            <Flex align="center" mb={2}>
                                <Badge bg="subbackground" color="text" mr={2}>Popularity: </Badge>
                                <Badge borderRadius="full" px={3} py={1} bg="gold" color="black">
                                    {mangaDetails.popularity}
                                </Badge>
                            </Flex>
                        )}
                        {mangaDetails.status && (
                            <Flex align="center" mb={2}>
                                <Badge bg="subbackground" color="text" mr={2}>Status: </Badge>
                                <Badge borderRadius="full" px={3} py={1} color={getStatusColor(mangaDetails.status)}>
                                    {mangaDetails.status}
                                </Badge>
                            </Flex>
                        )}
                    </Flex>
                    <Box mb={6}>
                        <Text fontSize="lg" mb={2} color="subheading">Genres: </Text>
                        <Flex wrap="wrap">
                            {mangaDetails.genres && mangaDetails.genres.map((genre, index) => {
                                const color = genreColor[genre.toLowerCase()] || '#555';
                                const textColor = getContrastColor(color);
                                return (
                                    <Box
                                        key={index}
                                        bg={color}
                                        color={textColor}
                                        px={3}
                                        py={1}
                                        mr={2}
                                        mb={2}
                                        borderRadius="md"
                                        fontSize="sm"
                                        fontWeight="bold"
                                        cursor="default"
                                    >
                                        {genre}
                                    </Box>
                                );
                            })}
                        </Flex>
                    </Box>
                </Box>
            </Grid>
            <Box maxW="1200px" mx="auto">
                <Heading as="h2" size="xl" mb={6} color="heading">Reviews</Heading>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <Box key={review.uniqueId} bg="subbackground" p={4} mb={4} borderRadius="md">
                            <Flex justify="space-between" align="center" mb={2}>
                                <Link to={`/profile/${review.uniqueId}`} onClick={() => handleViewProfile(review.uniqueId)}>
                                    <Text fontWeight="bold" color="blue.400">{review.username}</Text>
                                </Link>
                                <Flex>
                                    {Array.from({ length: review.rating }, (_, i) => (
                                        <FaStar key={i} color="#ffc107" />
                                    ))}
                                    {Array.from({ length: 5 - review.rating }, (_, i) => (
                                        <FaStar key={i} color="#888" />
                                    ))}
                                </Flex>
                            </Flex>
                            <Text color="gray.300">{review.comment}</Text>
                        </Box>
                    ))
                ) : (
                    <Text fontSize="lg" color="gray.500">No reviews yet.</Text>
                )}
                <Textarea
                    placeholder="Leave a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    bg="subbackground"
                    color="white"
                    borderColor="gray.600"
                    _hover={{ borderColor: 'gray.500' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                    mb={4}
                />
                <Flex mb={4}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                            key={i}
                            color={i < newRating ? '#ffc107' : '#888'}
                            onClick={() => setNewRating(i + 1)}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
                </Flex>
                <Button colorScheme="blue" onClick={handleCommentSubmit}>
                    Submit
                </Button>
            </Box>
            <Box mt={12} textAlign="center">
                <Link to="/search">
                    <Flex align="center" justify="center" color="white">
                        <FaArrowLeft />
                        <Text ml={2} mt={3}>Back to Search</Text>
                    </Flex>
                </Link>
            </Box>
        </Box>
    );
};

// Helper function to determine the contrast color for genre badges
const getContrastColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000' : '#fff';
};

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

export default MangaDetails;