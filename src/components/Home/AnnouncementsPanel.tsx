// AnnouncementsPanel.tsx
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
    <Box bg="section" p={4} borderRadius="md" boxShadow="md" border="true" borderWidth={7} borderColor="subbackground">
      <Heading as="h2" size="xl" mb={4} color="heading">
        Announcements
      </Heading>
      {announcements.map((announcement) => (
        <Box key={announcement._id} mb={4} color="subbackground">
          <Text fontWeight="bold" color="heading">
            {announcement.title}
          </Text>
          <Text color="subheading" mt={-2}>
            {new Date(announcement.createdAt).toLocaleString()}
          </Text>
          {announcement.content.length > 100 ? (
            <Link as={RouterLink} to={`/announcements/${announcement._id}`} color="blue.400">
              Read more
            </Link>
          ) : (
            <Text color="text">{announcement.content}</Text>
          )}
        </Box>
      ))}
      <Spacer mt={50} />
      <Link as={RouterLink} to="/announcements" color="blue.400">
        View all announcements
      </Link>
    </Box>
  );
};

export default AnnouncementsPanel;