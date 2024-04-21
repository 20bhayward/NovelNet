// MangaPanel.tsx
import React from 'react';
import { Box, Heading, List, ListItem, Link } from '@chakra-ui/react';

interface MangaPanelProps {
  title: string;
  mangaList: any[];
}

const MangaPanel: React.FC<MangaPanelProps> = ({ title, mangaList }) => {
  return (
    <Box bg="section" p={4} borderRadius="md" boxShadow="md">
      <Heading as="h2" size="lg" mb={4} color="heading">
        {title}
      </Heading>
      <List spacing={2}>
        {mangaList.map((manga) => (
          <ListItem key={manga.id}>
            <Link href={`/manga/${manga.id}`} color="blue.400">
              {manga.title}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MangaPanel;