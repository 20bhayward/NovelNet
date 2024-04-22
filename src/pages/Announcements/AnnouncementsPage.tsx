// AnnouncementsPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Textarea, Grid, GridItem } from '@chakra-ui/react';
import api from '../../services/api';

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editingAnnouncement) {
      setEditingAnnouncement({ ...editingAnnouncement, [e.target.name]: e.target.value });
    } else {
      setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        const response = await api.put(`/api/announcements/${editingAnnouncement._id}`, editingAnnouncement);
        setAnnouncements(announcements.map((a) => (a._id === response.data._id ? response.data : a)));
        setEditingAnnouncement(null);
      } else {
        const response = await api.post('/api/announcements', newAnnouncement);
        setAnnouncements([...announcements, response.data]);
        setNewAnnouncement({ title: '', content: '' });
      }
    } catch (error) {
      console.error('Error submitting announcement:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return (
    <Box bg="background" minH="100vh" p={8}>
      <Heading as="h1" size="2xl" mb={8} color="heading">
        Announcements
      </Heading>
      {isAdmin && (
        <Box mb={8}>
          <Heading as="h2" size="xl" mb={4} color="heading">
            {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
          </Heading>
          <form onSubmit={handleSubmit}>
            <Textarea
              name="title"
              placeholder="Title"
              value={editingAnnouncement ? editingAnnouncement.title : newAnnouncement.title}
              onChange={handleInputChange}
              mb={4}
              bg="subbackground"
              color="white"
              borderColor="border"
            />
            <Textarea
              name="content"
              placeholder="Content"
              value={editingAnnouncement ? editingAnnouncement.content : newAnnouncement.content}
              onChange={handleInputChange}
              mb={4}
              bg="subbackground"
              color="white"
              borderColor="border"
            />
            <Button type="submit" colorScheme="blue">
              {editingAnnouncement ? 'Update' : 'Create'}
            </Button>
            {editingAnnouncement && (
              <Button ml={4} onClick={() => setEditingAnnouncement(null)}>
                Cancel
              </Button>
            )}
          </form>
        </Box>
      )}
      <Grid templateColumns={['1fr', '1fr', '1fr 3fr']} gap={8}>
        <GridItem>
          {/* Sidebar */}
          {/* Add any additional sidebar content */}
        </GridItem>
        <GridItem>
          {announcements.map((announcement) => (
            <Box key={announcement._id} mb={8} bg="section" p={4} borderRadius="md" boxShadow="md">
              <Heading as="h3" size="lg" mb={2} color="heading">
                {announcement.title}
              </Heading>
              <Text color="subheading" mb={2}>
                {new Date(announcement.createdAt).toLocaleString()}
              </Text>
              <Text color="text">{announcement.content}</Text>
              {isAdmin && (
                <Box mt={4}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => setEditingAnnouncement(announcement)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(announcement._id)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AnnouncementsPage;