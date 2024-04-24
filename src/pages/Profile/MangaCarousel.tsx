import React, { useState } from 'react';
import { Box, Flex, Icon, Text, Image } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface Manga {
  _id: string;
  id: string;
  title: string;
  image: string;
  rating?: number;
  popularity?: number;
  lastVisited?: number;
}

interface MangaCarouselProps {
  manga: Manga[];
}

const MangaCarousel: React.FC<MangaCarouselProps> = ({ manga }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const itemsPerPage = 3;
  const totalPages = Math.ceil(manga.length / itemsPerPage);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1));
    setDirection('left');
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1));
    setDirection('right');
  };

  const handleCarouselSelect = (selectedIndex: number) => {
    setActiveIndex(selectedIndex);
    setDirection(selectedIndex > activeIndex ? 'right' : 'left');
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
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={`carousel-page-${activeIndex}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            gap: '1rem',
            width: '100%',
            justifyContent: 'center',
            height: '300px',
          }}
        >
          {mangaToDisplay.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.05, zIndex: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: 'md',
                maxWidth: '200px',
                position: 'relative',
              }}
            >
              <Box
                bg="subbackground"
                height="100%"
                cursor="pointer"
                as={Link}
                to={`/manga/${item.id}`}
                position="relative"
                borderRadius="0.5rem"
                overflow="hidden"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  objectFit="cover"
                  height="100%"
                  width="100%"
                  borderRadius="0.5rem"
                />
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  width="100%"
                  backgroundColor="rgba(0, 0, 0, 0.6)"
                  py={2}
                  px={4}
                  borderBottomRadius="0.5rem"
                >
                  <Text fontWeight="bold" fontSize="md" color="white" noOfLines={2} textAlign="center">
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
    <Box bg="subbackground" p={6} ml={-4} borderRadius="md" boxShadow="md" position="relative">
      <Box position="relative" overflow="hidden" width="100%" height="300px">
        {manga.length > 0 && renderMangaList()}
      </Box>
      {manga.length > 0 && (
        <Flex justifyContent="center" alignItems="center" mt={4}>
          <Icon as={FaChevronLeft} mr={2} color="section" cursor="pointer" onClick={handlePrev} />
          {Array.from({ length: totalPages }).map((_, index) => (
            <Icon
              key={index}
              as={FaCircle}
              color={index === activeIndex ? 'section' : 'button'}
              mx={2}
              cursor="pointer"
              onClick={() => handleCarouselSelect(index)}
              boxSize={3}
            />
          ))}
          <Icon as={FaChevronRight} ml={2} color="section" cursor="pointer" onClick={handleNext} />
        </Flex>
      )}
    </Box>
  );
};

export default MangaCarousel;