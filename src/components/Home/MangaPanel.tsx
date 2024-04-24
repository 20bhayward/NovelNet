import React from 'react';
import { Box, Heading, Grid, GridItem, Image, Text } from '@chakra-ui/react';

interface Manga {
  _id: string;
  title: string;
  image: string;
  rating?: number;
  popularity?: number;
  genres?: string[];
}

interface MangaPanelProps {
  title: string;
  mangaList: Manga[];
}

const MangaPanel: React.FC<MangaPanelProps> = ({ title, mangaList }) => {
  return (
    <Box bg="subbackground" p={4} mt={10} boxShadow="md" ml="11%" width="78%" lineHeight="tight" overflow="hidden">
      <Heading as="h2" size="lg" mb={4} color="heading" fontFamily="heading" fontWeight="bold">
        {title}
      </Heading>
      <Grid templateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(6, 1fr)']} gap={4}>
        {mangaList.map((manga) => (
          <GridItem key={manga._id}>
            <Box
              bg="subbackground"
              borderRadius="md"
              overflow="hidden"
              cursor="pointer"
              transition="transform 0.3s"
              _hover={{ transform: 'scale(1.05)' }}
            >
              <Image src={manga.image} alt={manga.title} objectFit="cover" />
              <Box p={2}>
                <Text fontSize="sm" fontWeight="bold" color="white" noOfLines={2} fontFamily="body">
                  {manga.title}
                </Text>
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default MangaPanel;