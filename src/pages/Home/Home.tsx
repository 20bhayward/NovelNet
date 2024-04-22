// Home.tsx
import React, { useEffect, useState, useContext } from 'react';
import { Box, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import { AuthContext } from '../../contexts/AuthContext';
import MangaPanel from '../../components/Home/MangaPanel';
import AnnouncementsPanel from '../../components/Home/AnnouncementsPanel';
import FeaturedManga from '../../components/Home/FeaturedManga';
import api from '../../services/api';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [followedManga, setFollowedManga] = useState([]);
  const [favoriteManga, setFavoriteManga] = useState([]);
  const [readingManga, setReadingManga] = useState([]);

  useEffect(() => {
    const fetchUserManga = async () => {
      try {
        if (isAuthenticated && user) {
          const response = await api.get(`/api/users/${user.userId}/manga`,  { withCredentials: true });
          setFollowedManga(response.data.followedManga);
          setFavoriteManga(response.data.favoriteManga);
          setReadingManga(response.data.readingManga);
        }
      } catch (error) {
        console.error('Error fetching user manga:', error);
      }
    };

    fetchUserManga();
  }, [isAuthenticated, user]);

  return (
    <Box bg="background" minH="100vh" p={4}>
      <Flex direction={['column', 'column', 'row']} mb={8}>
        <Box flex="1"></Box>
        <Box flex="5" mr={[0, 0, 25]}>
          <FeaturedManga />
        </Box>
        <Box flex="2">
          <AnnouncementsPanel />
        </Box>
        <Box flex="1"></Box>
      </Flex>
      <Flex direction={['column', 'column', 'row']} mb={8}>
        <Box flex="1"></Box>
        {isAuthenticated && user ? (
          <Grid flex="7" templateColumns={['1fr', '1fr', 'repeat(3, 1fr)']} gap={6}>
            <GridItem>
              <MangaPanel title="Followed Manga" mangaList={followedManga} />
            </GridItem>
            <GridItem>
              <MangaPanel title="Favorite Manga" mangaList={favoriteManga} />
            </GridItem>
            <GridItem>
              <MangaPanel title="Reading Manga" mangaList={readingManga} />
            </GridItem>
          </Grid>
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
        <Box flex="1"></Box>
      </Flex>
    </Box>
  );
};

export default Home;