import React, { useEffect, useState, useContext } from 'react';
import { Box, Flex, Heading, Text, Spinner } from '@chakra-ui/react';
import { AuthContext } from '../../contexts/AuthContext';
import AnnouncementsPanel from '../../components/Home/AnnouncementsPanel';
import FeaturedManga from '../../components/Home/FeaturedManga';
import api from '../../services/api';
import MangaPanel from '../../components/Home/MangaPanel';

interface Manga {
  _id: string;
  title: string;
  image: string;
  rating: number;
  popularity: number;
  genres: string[];
}

const Home: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [followedManga, setFollowedManga] = useState<Manga[]>([]);
  const [favoriteManga, setFavoriteManga] = useState<Manga[]>([]);
  const [readingManga, setReadingManga] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserManga = async () => {
      try {
        setIsLoading(false);
        if (isAuthenticated && user) {
          setIsLoading(true);
          const response = await api.get(`/api/users/${user._id}/manga`, { withCredentials: true });
          const { followedManga, favoriteManga, readingManga } = response.data;
          setFollowedManga(followedManga);
          setFavoriteManga(favoriteManga);
          setReadingManga(readingManga);
          setIsLoading(false);
        } 
      } catch (error) {
        console.error('Error fetching user manga:', error);
      }
    };

    fetchUserManga();
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <Box bg="background" minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  return (
    <Box bg="background" minH="100vh" p={4}>
      <Flex direction={['column', 'column', 'row']} mb={8}>
      {isAuthenticated && user ? (
        <><Box flex="1"></Box>
        <Box flex="5" mr={[0, 0, 25]}>
          <FeaturedManga />
        </Box>
        <Box flex="2">
          <AnnouncementsPanel />
        </Box>
        <Box flex="1"></Box></>
      ) : ( 
        <> <Box flex="1"></Box>
      <Box flex="7" mr={[0, 0, 25]}>
        <FeaturedManga />
      </Box>
      <Box flex="1"></Box></>
      )};
      </Flex>
      {isAuthenticated && user ? (
        <>
          <MangaPanel title="Followed Manga" mangaList={followedManga} />
          <MangaPanel title="Favorite Manga" mangaList={favoriteManga} />
          <MangaPanel title="Reading Manga" mangaList={readingManga} />
        </>
      ) : (
        <Box mt={8} textAlign="center">
          <Heading as="h1" size="2xl" mb={4} color="heading">
            Welcome to Lore Library
          </Heading>
          <Text fontSize="xl" color="subheading">
            Explore the world of manga and novels!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Home;