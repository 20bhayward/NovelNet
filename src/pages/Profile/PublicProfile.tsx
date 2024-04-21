import React, { useContext, useEffect, useState } from 'react';
import axios from '../../services/api';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Box, Avatar, Grid, Divider, Heading, Text, Textarea, Button, Center, color, Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

interface ProfileComment {
  uniqueId: string;
  username: string;
  comment: string;
  profileId: string;
}

interface PublicProfileProps {
  userId: string;
}

const PublicProfile: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [comments, setComments] = useState<ProfileComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const response = await axios.get(`/api/users/profile/${uniqueId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching public profile:', error);
      }
    };

    const fetchProfileComments = async () => {
      try {
        const response = await axios.get(`/api/users/profile/${uniqueId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching profile comments:', error);
      }
    };

    if (uniqueId) {
      fetchPublicProfile();
      fetchProfileComments();
    }
  }, [uniqueId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('You must be logged in to leave a comment.');
      return;
    }

    try {
      const newCommentData = {
        commenterUniqueId: user?.uniqueId || '',
        commenterUsername: user?.username || '',
        comment: newComment,
      };

      const response = await axios.post(`/api/users/profile/${uniqueId}/comments`, newCommentData);
      const savedComment = response.data;
      setComments([...comments, savedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting profile comment:', error);
      alert('Failed to submit the comment. Please try again.');
    }
  };

  if (!profile) {
    return <Box bg="background" minH="100vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner size="xl" color="blue.500" />
    </Box>
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
          <Box bg="subbackground" p={6} borderRadius="md" boxShadow="md" mb={8} >
            <Heading as="h3" size="lg" mb={4} color="heading">
              Following
            </Heading>
            {profile.followedManga.map((manga: any) => (
              <Text key={manga._id} mb={2} color="white">
                {manga.title}
              </Text>
            ))}
          </Box>
          <Box bg="subbackground" p={6} borderRadius="md" boxShadow="md" mb={8}>
            <Heading as="h3" size="lg" mb={4} color="heading">
              Favorites
            </Heading>
            {profile.favoriteManga.map((manga: any) => (
              <Text key={manga._id} mb={2} color="white">
                {manga.title}
              </Text>
            ))}
          </Box>
          <Box bg="subbackground" p={6} borderRadius="md" boxShadow="md" >
            <Heading as="h3" size="lg" mb={4} color="heading">
              Reading
            </Heading>
            {profile.readingManga.map((manga: any) => (
              <Text key={manga._id} mb={2} color="white">
                {manga.title}
              </Text>
            ))}
          </Box>
        </Box>
      </Grid>
      <Box mt={8} maxW="1200px" mx="auto">
        <Box bg="subbackground" p={6} borderRadius="md" boxShadow="md" >
          <Heading as="h3" size="lg" mb={4} color="heading">
            Comments
          </Heading>
          {comments.map((comment) => (
            <Box key={comment.uniqueId} mb={4} p={4} bg="section" borderRadius="md">
              <Text fontWeight="bold" color="white">{comment.username}</Text>
              <Text mt={2} color="subheading">{comment.comment}</Text>
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
                color="background"
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