import React, { useState, useEffect } from 'react';
import { Box, Heading, Spacer, Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../services/api';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const AnnouncementsPanel: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get('/api/announcements');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <Box bg="section" p={4} height='535px' borderRadius="md" boxShadow="md" border="true" borderWidth={7} borderColor="subbackground" >
      <Heading as="h2" size="xl" mb={4} color="heading">
        Announcements
      </Heading>
      {announcements.slice(0, 2).map((announcement) => (
        <Box key={announcement._id} mb={4} bg="subbackground" borderRadius="md" boxShadow="lg" border="true" borderWidth={7} p={4} borderColor="section" color="section" >
          <Text fontWeight="bold" color="heading">
            {announcement.title}
          </Text>
          <Text color="subheading" mt={-4}>
            {new Date(announcement.createdAt).toLocaleString()}
          </Text>
          {announcement.content.length > 100 ? (
            <Link as={RouterLink} to={`/announcements`} color="blue.400">
              Read more
            </Link>
          ) : (
            <Text color="text">{announcement.content}</Text>
          )}
        </Box>
      ))}
      <Spacer mt={50} />
      <Box as={RouterLink} to="/announcements"  bg="subbackground" borderRadius="lg" boxShadow="lg" border="true" borderWidth={7} p={4} borderColor="section"color="blue.400" >
        View all announcements
      </Box>
    </Box>
  );
};

export default AnnouncementsPanel;