import React, { useContext, useEffect, useState } from 'react';
import { Box, Avatar, Grid, Divider, Heading, Text, Textarea, Button, Spinner, Flex, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Image } from '@chakra-ui/react';
import api from '../../services/api';
import MangaCarousel from './MangaCarousel';

interface ProfileComment {
  _id: string;
  username: string;
  comment: string;
  profileId: string;
  key: string;
}

interface Manga {
  _id: string;
  title: string;
  image: string;
  rating?: number;
  popularity?: number;
  lastVisited?: number;
}

const PublicProfile: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { _id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [comments, setComments] = useState<ProfileComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [followedManga, setFollowedManga] = useState<Manga[]>([]);
  const [favoriteManga, setFavoriteManga] = useState<Manga[]>([]);
  const [readingManga, setReadingManga] = useState<Manga[]>([]);

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
        setComments(response.data.map((comment: { _id: any; }, index: any) => ({ ...comment, key: `${comment._id}-${index}` })));
      } catch (error) {
        console.error('Error fetching profile comments:', error);
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

    if (_id) {
      fetchPublicProfile();
      fetchProfileComments();
    }
    fetchUserManga();
  }, [_id, isAuthenticated, user]);

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

      const response = await api.post(`/api/users/profile/${_id}/comments`, newCommentData);
      const savedComment = response.data;
      setComments([...comments, savedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting profile comment:', error);
      alert('Failed to submit the comment. Please try again.');
    }
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
            <TabList boxSize={10} color="subbackground" bg="subbackground">
              <Tab bg="subbackground" color="white" _selected={{ color: 'white', bg: 'gray' }}>
                Following
              </Tab>
              <Tab bg="subbackground" color="white" _selected={{ color: 'white', bg: 'gray' }}>
                Favorites
              </Tab>
              <Tab bg="subbackground" color="white" _selected={{ color: 'white', bg: 'gray' }}>
                Reading
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <MangaCarousel manga={followedManga || []} />
              </TabPanel>
              <TabPanel>
                <MangaCarousel manga={favoriteManga || []} />
              </TabPanel>
              <TabPanel>
                <MangaCarousel manga={readingManga || []} />
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
            <Box key={comment.key} mb={4} p={4} bg="section" borderRadius="md">
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