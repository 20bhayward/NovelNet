import React, { useContext, useEffect, useState } from 'react';
import { Box, Avatar, Grid, Divider, Heading, Text, Textarea, Button, Spinner, Flex, Select, Tabs, TabList, Tab, TabPanels, TabPanel, GridItem } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Image } from '@chakra-ui/react';
import api from '../../services/api';
import axios from 'axios';
interface ProfileComment {
  _id: string;
  username: string;
  comment: string;
  profileId: string;
}

interface Manga {
  _id: string;
  title: string;
  image: string;
  rating: number;
  popularity: number;
  lastVisited: number;
}

const PublicProfile: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { _id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [comments, setComments] = useState<ProfileComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [followedManga, setFollowedManga] = useState<Manga[]>([]);
  const [favoriteManga, setFavoriteManga] = useState<Manga[]>([]);
  const [readingManga, setReadingManga] = useState<Manga[]>([]);
  const [sortBy, setSortBy] = useState<string>('lastVisited');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const response = await api.get(`/api/users/profile/${_id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching public profile:', error);
      }
    };

    const fetchProfileComments = async () => {
      try {
        const response = await api.get(`/api/users/profile/${_id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching profile comments:', error);
      }
    };
    
    const fetchMangaDetails = async (mangaIds: string[], setState: React.Dispatch<React.SetStateAction<Manga[]>>) => {
      try {
        const mangaDetails = await Promise.all(
          mangaIds.map(async (mangaId) => {
            const response = await axios.get(`https://consumet-api-z0sh.onrender.com/meta/anilist/info/${mangaId}?provider=mangadex`);
            const mangaData = response.data;
            return {
              _id: mangaData.id,
              title: mangaData.title.romaji || mangaData.title.english || mangaData.title.native,
              image: mangaData.image,
              rating: mangaData.rating || 0,
              popularity: mangaData.popularity || 0,
              lastVisited: Date.now(),
            };
          })
        );
        setState(mangaDetails);
      } catch (error) {
        console.error('Error fetching manga details:', error);
      }
    };

    const fetchUserManga = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/users/${_id}/manga`);
        const { followedManga, favoriteManga, readingManga } = response.data;
        await Promise.all([
          fetchMangaDetails(followedManga, setFollowedManga),
          fetchMangaDetails(favoriteManga, setFavoriteManga),
          fetchMangaDetails(readingManga, setReadingManga),
        ]);
      } catch (error) {
        console.error('Error fetching user manga:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (_id) {
      fetchPublicProfile();
      fetchProfileComments();
      fetchUserManga();
    }
  }, [_id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('You must be logged in to leave a comment.');
      return;
    }

    try {
      const newCommentData = {
        commenterUniqueId: user?._id || '',
        commenterUsername: user?.username || '',
        comment: newComment,
      };

      const response = await axios.post(`/api/users/profile/${_id}/comments`, newCommentData);
      const savedComment = response.data;
      setComments([...comments, savedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting profile comment:', error);
      alert('Failed to submit the comment. Please try again.');
    }
  };

  const sortManga = (manga: Manga[]) => {
    switch (sortBy) {
      case 'lastVisited':
        return manga.sort((a, b) => b.lastVisited - a.lastVisited);
      case 'alphabetical':
        return manga.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return manga.sort((a, b) => b.rating - a.rating);
      case 'popularity':
        return manga.sort((a, b) => b.popularity - a.popularity);
      default:
        return manga;
    }
  };

  const renderMangaList = (manga: Manga[]) => {
    return (
      <Grid templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={4}>
        {sortManga(manga).map((item) => (
          <GridItem key={item._id}>
            <Box
              bg="subbackground"
              borderRadius="md"
              boxShadow="md"
              overflow="hidden"
              cursor="pointer"
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.05)' }}
              onClick={() => navigate(`/manga/${item._id}`)}
            >
              <Image src={item.image} alt={item.title} objectFit="cover" />
              <Box p={2}>
                <Text fontWeight="bold" fontSize="sm" color="white" noOfLines={2}>
                  {item.title}
                </Text>
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>
    );
  };

  if (isLoading || !profile) {
    return (
      <Box bg="background" minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }
  return (
    <Box bg="background" minHeight="100vh" py={8}>
      <Grid templateColumns={['1fr', '1fr', '1fr 2fr']} gap={8} maxW="1200px" mx="auto">
        <Box bg="subbackground" p={6} borderRadius="md" boxShadow="md">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Avatar
              size="2xl"
              name={profile.username}
              src={profile.profilePicture ? `${process.env.REACT_APP_API_URL}${profile.profilePicture}` : ''}
              mb={4}
            />
          </Box>
          <Heading as="h2" size="xl" color="white" textAlign="center" mb={2}>
            {profile.username}
          </Heading>
          <Divider my={4} />
          <Text fontSize="xl" textAlign="center" color="white" mb={2}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text fontSize="lg" textAlign="center" color="white" mb={2}>
            {profile.gender}
          </Text>
          <Text fontSize="lg" textAlign="center" color="white">
            {profile.location}
          </Text>
        </Box>
        <Box>
          <Tabs>
            <TabList boxSize={10} color='subbackground' bg='subbackground'>
              <Tab bg='subbackground'  color="white" _selected={{ color: 'white', bg: 'gray' }}>Following</Tab>
              <Tab bg='subbackground' color="white" _selected={{ color: 'white', bg: 'gray' }}>Favorites</Tab>
              <Tab bg='subbackground' color="white" _selected={{ color: 'white', bg: 'gray' }}>Reading</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex justify="space-between" align="center" mb={4}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    w="auto"
                    bg="subbackground"
                    color="white"
                    borderColor="border"
                  >
                    <option value="lastVisited">Last Visited</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="rating">Rating</option>
                    <option value="popularity">Popularity</option>
                  </Select>
                </Flex>
                {renderMangaList(followedManga)}
              </TabPanel>
              <TabPanel>
                <Flex justify="space-between" align="center" mb={4}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    w="auto"
                    bg="subbackground"
                    color="white"
                    borderColor="border"
                  >
                    <option value="lastVisited">Last Visited</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="rating">Rating</option>
                    <option value="popularity">Popularity</option>
                  </Select>
                </Flex>
                {renderMangaList(favoriteManga)}
              </TabPanel>
              <TabPanel>
                <Flex justify="space-between" align="center" mb={4}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    w="auto"
                    bg="subbackground"
                    color="white"
                    borderColor="border"
                  >
                    <option value="lastVisited">Last Visited</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="rating">Rating</option>
                    <option value="popularity">Popularity</option>
                  </Select>
                </Flex>
                {renderMangaList(readingManga)}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Grid>
      <Box mt={8} maxW="1200px" mx="auto">
        <Box bg="subbackground" p={6} borderRadius="md" boxShadow="md">
          <Heading as="h3" size="lg" mb={4} color="heading">
            Comments
          </Heading>
          {comments.map((comment) => (
            <Box key={comment._id} mb={4} p={4} bg="section" borderRadius="md">
              <Text fontWeight="bold" color="white">
                {comment.username}
              </Text>
              <Text mt={2} color="subheading">
                {comment.comment}
              </Text>
            </Box>
          ))}
          {isAuthenticated && (
            <form onSubmit={handleCommentSubmit}>
              <Textarea
                placeholder="Leave a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                mb={4}
                bg="section"
                color="white"
                borderColor="subbackground"
                _hover={{ borderColor: 'gray.400' }}
                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
              />
              <Button type="submit" colorScheme="blue">
                Submit
              </Button>
            </form>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PublicProfile;