// AnnouncementsPanel.tsx
import React from 'react';
import { Box, Heading, Spacer, Text } from '@chakra-ui/react';

const AnnouncementsPanel: React.FC = () => {
  return (
    <Box bg="section" p={4} borderRadius="md" boxShadow="md" border="true" borderWidth={7} borderColor="subbackground">
      <Heading as="h2" size="xl" mb={4} color="heading">
        Announcements
      </Heading>
      <Box mb={4} color="subbackground">
        <Text fontWeight="bold" color="heading">
          Beginning of Website Development
        </Text>
        <Text color="subheading" mt={-2}>
          15 days ago</Text>
      </Box>
      <Spacer mt={50}/>
      <Box>
        <Text fontWeight="bold" color="heading" >
          The Home Page Overhaul Is Underway!
        </Text>
        <Text color="subheading" mt={-2}>7 days ago</Text>
      </Box>
    </Box>
  );
};

export default AnnouncementsPanel;