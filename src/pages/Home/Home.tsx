// Home.tsx
import React, { useEffect, useState, useContext } from 'react';
import { Box, Flex, Grid, GridItem, Heading, Text, Image, Badge } from '@chakra-ui/react';
import { AuthContext } from '../../contexts/AuthContext';
import AnnouncementsPanel from '../../components/Home/AnnouncementsPanel';
import FeaturedManga from '../../components/Home/FeaturedManga';
import api from '../../services/api';
import axios from 'axios';
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

  useEffect(() => {
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
              genres: mangaData.genres,
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
          if (isAuthenticated && user) {
              const response = await api.get(`/api/users/${user._id}/manga`, { withCredentials: true });
              const { followedManga, favoriteManga, readingManga } = response.data;
              setFollowedManga(followedManga);
              setFavoriteManga(favoriteManga);
              setReadingManga(readingManga);
          }
      } catch (error) {
          console.error('Error fetching user manga:', error);
      }
  };

    fetchUserManga();
  }, [isAuthenticated, user]);

  const renderMangaList = (title: string, mangaList: Manga[]) => {
    return (
      <Box mb={8}>
        <Heading as="h2" size="xl" mb={4} color="heading">
          {title}
        </Heading>
        <Grid templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={6}>
          {mangaList.map((manga) => (
            <GridItem
              key={manga._id}
              bg="subbackground"
              borderRadius="md"
              boxShadow="md"
              overflow="hidden"
              transition="transform 0.3s"
              _hover={{ transform: 'scale(1.05)' }}
            >
              <Image src={manga.image} alt={manga.title} objectFit="cover" />
              <Box p={4}>
                <Heading as="h3" size="md" color="white" mb={2}>
                  {manga.title}
                </Heading>
                <Flex align="center" mb={2}>
                  <Badge borderRadius="full" px={2} py={1} mr={2} bg="gold">
                    {manga.rating}
                  </Badge>
                  <Badge borderRadius="full" px={2} py={1} bg="purple.500">
                    #{manga.popularity}
                  </Badge>
                </Flex>
                <Flex wrap="wrap">
                  {manga.genres.map((genre) => (
                    <Badge key={genre} borderRadius="full" px={2} py={1} mr={2} mb={2} bg="gray.500">
                      {genre}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>
    );
  };

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