// pages/Announcements/AnnouncementsPage.tsx
import React, { useState, useEffect, useContext } from 'react';
import { Box, Heading, Text, Button, Grid, GridItem, Avatar, Flex, ModalHeader, ModalCloseButton, ModalBody, ModalContent, Modal, ModalOverlay } from '@chakra-ui/react';
import api from '../../services/api';
import AnnouncementForm from '../../components/Admin/AnnouncementForm';
import { AuthContext } from '../../contexts/AuthContext';

interface ShowFullContentState {
    [key: string]: boolean;
}


const AnnouncementsPage: React.FC = () => {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
    const { isAdmin } = useContext(AuthContext);
    const [pinnedAnnouncement, setPinnedAnnouncement] = useState<any | null>(null);
    const [showFullContent, setShowFullContent] = useState<ShowFullContentState>({});

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

    const handleSubmit = async (values: any) => {
        try {
            if (editingAnnouncement) {
                const response = await api.put(`/api/announcements/${editingAnnouncement._id}`, values);
                setAnnouncements(announcements.map((a) => (a._id === response.data._id ? response.data : a)));
                setEditingAnnouncement(null);
            } else {
                const response = await api.post('/api/announcements', values);
                setAnnouncements([...announcements, response.data]);
            }
            setFormOpen(false);
        } catch (error) {
            console.error('Error submitting announcement:', error);
        }
    };

    const handleEdit = (announcement: any) => {
        setEditingAnnouncement(announcement);
        setFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/api/announcements/${id}`);
            setAnnouncements(announcements.filter((a) => a._id !== id));
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    const handlePin = async (id: string) => {
        try {
            const response = await api.put(`/api/announcements/${id}/pin`);
            setPinnedAnnouncement(response.data);
        } catch (error) {
            console.error('Error pinning announcement:', error);
        }
    };

    const handleShowMore = (id: string | number) => {
        setShowFullContent((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    return (
        <Box bg="background" minH="100vh" p={8}>
            <Flex justify="space-between" align="center" mb={8}>
                <Heading as="h1" size="2xl" color="heading" ml='10%' >
                    General Announcements
                </Heading>
                {isAdmin && (
                    <Button colorScheme="blue"  mr='10%' onClick={() => setFormOpen(true)}>
                        + Create Announcement
                    </Button>
                )}
            </Flex>
            {pinnedAnnouncement && (
                <Box mb={8} bg="section" p={4} borderRadius="md" boxShadow="md">
                    <Heading as="h3" size="lg" mb={2} color="heading">
                        {pinnedAnnouncement.title}
                    </Heading>
                    <Text color="subheading" mb={2}>
                        By {pinnedAnnouncement.createdBy.username} on{' '}
                        {new Date(pinnedAnnouncement.createdAt).toLocaleString()}
                    </Text>
                    <Text color="text">{pinnedAnnouncement.content}</Text>
                    {isAdmin && (
                        <Flex mt={4}>
                            <Button
                                size="sm"
                                colorScheme="blue"
                                mr={2}
                                onClick={() => handleEdit(pinnedAnnouncement)}
                            >
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                colorScheme="red"
                                mr={2}
                                onClick={() => handleDelete(pinnedAnnouncement._id)}
                            >
                                Delete
                            </Button>
                        </Flex>
                    )}
                </Box>
            )}
            {announcements
                .filter((announcement) => !pinnedAnnouncement || announcement._id !== pinnedAnnouncement._id)
                .map((announcement) => (
                    <Box key={announcement._id} mb={8} bg="section" p={4} borderRadius="md" boxShadow="md" width='80%' ml='10%'>
                        <Heading as="h3" size="lg" mb={2} color="heading">
                            {announcement.title}
                        </Heading>
                        <Text color="subheading" mb={2}>
                            By {announcement.createdBy.username} on {new Date(announcement.createdAt).toLocaleString()}
                        </Text>
                        {announcement.content.length > 200 ? (
                            <>
                            <Text display={showFullContent[announcement._id] ? 'none' : 'block'} color="text">{announcement.content.slice(0,200)}...</Text>
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    mt={2}
                                    onClick={() => handleShowMore(announcement._id)}
                                >
                                    {showFullContent[announcement._id] ? 'Show less' : 'Show more'}
                                </Button>
                                <Text color="text" mt={2} display={showFullContent[announcement._id] ? 'block' : 'none'}>
                                    {announcement.content}
                                </Text>
                            </>
                        ) : (
                            <Text color="text">{announcement.content}</Text>
                        )}
                        {isAdmin && (
                            <Flex mt={4}>
                                <Button size="sm" colorScheme="blue" mr={2} onClick={() => handleEdit(announcement)}>
                                    Edit
                                </Button>
                                <Button size="sm" colorScheme="red" mr={2} onClick={() => handleDelete(announcement._id)}>
                                    Delete
                                </Button>
                                <Button size="sm" colorScheme="green" onClick={() => handlePin(announcement._id)}>
                                    Pin
                                </Button>
                            </Flex>
                        )}
                    </Box>
                ))}
            <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader bg="background" color="white">{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody bg="subbackground">
                        <AnnouncementForm
                            initialValues={editingAnnouncement}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setEditingAnnouncement(null);
                                setFormOpen(false);
                            }}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AnnouncementsPage;