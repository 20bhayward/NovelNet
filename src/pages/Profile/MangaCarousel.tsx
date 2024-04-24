import React, { useContext, useState } from 'react';
import { Box, Flex, Icon, Grid, GridItem, Text, Image } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MangaContext } from '../../contexts/MangaContext';

interface Manga {
    _id: string;
    title: string;
    image: string;
    rating: number;
    popularity: number;
    lastVisited: number;
}

interface MangaCarouselProps {
    manga: Manga[];
}

const MangaCarousel: React.FC<MangaCarouselProps> = ({ manga }) => {
    const { mangaLists } = useContext<any>(MangaContext);
    const { followedManga, favoriteManga, readingManga } = mangaLists;
    const [activeIndex, setActiveIndex] = useState(0);
    const itemsPerPage = 3; // Adjust this value to change the number of items per page
    const totalPages = Math.ceil(manga.length / itemsPerPage);

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1));
    };

    const handleCarouselSelect = (selectedIndex: number) => {
        setActiveIndex(selectedIndex);
    };

    const variants = {
        enter: (direction: 'left' | 'right') => ({
          x: direction === 'right' ? '100%' : '-100%',
          opacity: 0,
        }),
        center: {
          x: 0,
          opacity: 1,
        },
        exit: (direction: 'left' | 'right') => ({
          x: direction === 'left' ? '100%' : '-100%',
          opacity: 0,
        }),
      };
     
    const renderMangaList = () => {
        const startIndex = activeIndex * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const mangaToDisplay = manga.slice(startIndex, endIndex);

        return (
            <AnimatePresence  initial={false}>
                <motion.div
                    key={`carousel-page-${activeIndex}`}
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.5 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: ['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)'].join(' '),
                        gap: '1rem',
                    }}
                >
                    {mangaToDisplay.map((item) => (
                        <motion.div
                            key={item._id}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                borderRadius: '0.5rem',
                                overflow: 'hidden',
                                boxShadow: 'md',
                                height: '300px', // Set a fixed height for all cards
                            }}
                        >
                            <Box
                                bg="subbackground"
                                height="100%"
                                cursor="pointer"
                                as={Link}
                                to={`/manga/${item._id}`}
                            >
                                <Image src={item.image} alt={item.title} objectFit="cover" height="200px" />
                                <Box p={2}>
                                    <Text fontWeight="bold" fontSize="sm" color="white" noOfLines={2}>
                                        {item.title}
                                    </Text>
                                </Box>
                            </Box>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <Box bg="subbackground" height="85%" width="104.5%" ml={-4} p={6} borderRadius="md" boxShadow="md">
            {renderMangaList()}
            <Flex mt={4} justifyContent="center" alignItems="center">
                <Icon as={FaChevronLeft} mr={2} color="section" cursor="pointer" onClick={handlePrev} />
                {Array.from({ length: totalPages }).map((_, index) => (
                    <Icon
                        key={index}
                        as={FaCircle}
                        color={index === activeIndex ? 'button' : 'subbackground'}
                        mr={2}
                        cursor="pointer"
                        onClick={() => handleCarouselSelect(index)}
                        boxSize={3}
                    />
                ))}
                <Icon as={FaChevronRight} ml={2} color="section" cursor="pointer" onClick={handleNext} />
            </Flex>
        </Box>
    );
};

export default MangaCarousel;