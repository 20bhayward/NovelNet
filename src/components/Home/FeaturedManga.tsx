import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaCircle, FaStar } from 'react-icons/fa';
import { Text, Box, Flex, Heading, Icon } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

interface MangaDetails {
  id: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  altTitles: string[];
  malId?: number;
  trailer?: {
    id: string;
    site: string;
    thumbnail: string;
  };
  image?: string;
  popularity?: number;
  color?: string;
  description?: string;
  status?: string;
  releaseDate?: number;
  startDate?: {
    year: number;
    month: number;
    day: number;
  };
  endDate?: {
    year: number;
    month: number;
    day: number;
  };
  rating?: number;
  genres?: string[];
  season?: string;
  studios?: string[];
  type?: string;
  recommendations?: {
    id: string;
    malId: string;
    title: string[];
    status: string;
    chapters: number;
    image: string;
    cover: string;
    rating: number;
    type: string;
  }[];
  characters?: {
    id: string;
    role: string;
    name: string[];
    image: string;
  }[];
  relations?: {
    id: number;
    relationType: string;
    malId: number;
    title: string[];
    status: string;
    chapters: number;
    image: string;
    color: string;
    type: string;
    cover: string;
    rating: number;
  }[];
  chapters?: {
    id: string;
    title: string;
    chapter: string;
  }[];
}

const FeaturedManga: React.FC = () => {
  const [featuredManga, setFeaturedManga] = useState<MangaDetails[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const getFeaturedManga = async () => {
      try {
        const response = await axios.get(
          'https://consumet-api-z0sh.onrender.com/meta/anilist/popular?provider=mangareader'
        );
        const results = response.data.results;

        // Take the top 5 results
        const featuredManga = results.slice(0, 5);

        setFeaturedManga(featuredManga);
      } catch (error) {
        console.error('Error fetching featured manga:', error);
      }
    };

    getFeaturedManga();
  }, []);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? featuredManga.length - 1 : prevIndex - 1
    );
    setDirection('left');
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === featuredManga.length - 1 ? 0 : prevIndex + 1
    );
    setDirection('right');
  };

  const handleCarouselSelect = (selectedIndex: number) => {
    setActiveIndex(selectedIndex);
    setDirection(selectedIndex > activeIndex ? 'right' : 'left');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [activeIndex, featuredManga]);

  const currentManga = featuredManga[activeIndex];

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
 
  return (
    <Box bg="subbackground" p={4} borderRadius="md" boxShadow="md">
      <Heading as="h2" size="xl" mb={4} color="heading">
        Featured Manga
      </Heading>
      <Flex>
        <Box  as={Link} to={`/manga/${currentManga?.id}`} flex="2" position="relative" overflow="hidden" height="400px">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentManga?.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <img
                src={currentManga?.image}
                alt={
                  currentManga?.title.romaji ||
                  currentManga?.title.english ||
                  currentManga?.title.native
                }
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                p={6}
                bg="rgba(0, 0, 0, 0.4)"
                color="white"
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
              >
                <Heading as="h3" size="xl" mb={4}>
                  {currentManga?.title.romaji ||
                    currentManga?.title.english ||
                    currentManga?.title.native}
                </Heading>
                <Flex justifyContent="space-between" mb={4}>
                  <Box display="flex" flexDirection="row" color="yellow.400">
                    <FaStar />
                    <Text mt={-1} ml={2}>
                      {currentManga?.rating}
                    </Text>
                  </Box>
                  <Text color="gray.400">Status: {currentManga?.status}</Text>
                </Flex>
                <Text noOfLines={3}>{currentManga?.description}</Text>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
        <Box flex="1" ml={4}>
          <img
            src={currentManga?.image}
            alt={
              currentManga?.title.romaji ||
              currentManga?.title.english ||
              currentManga?.title.native
            }
            style={{ width: '300px', height: '400px', objectFit: 'scale-down' }}
          />
        </Box>
      </Flex>
      <Flex mt={4} justifyContent="center" alignItems="center">
      <Box flex={1}></Box>
        <Icon
          as={FaChevronLeft}
          mr={2}
          color="section"
          cursor="pointer"
          onClick={handlePrev}
        />
        
        {featuredManga.map((_, index) => (
          <Icon
          
            key={index}
            as={FaCircle}
            color={index === activeIndex ? 'button' : 'background'}
            mr={2}
            cursor="pointer"
            onClick={() => handleCarouselSelect(index)}
            boxSize={3}
          />
        ))}
        <Icon
          as={FaChevronRight}
          ml={2}
          color="section"
          cursor="pointer"
          onClick={handleNext}
        />
        <Box flex={2}></Box>
      </Flex>
    </Box>
  );
};

export default FeaturedManga;