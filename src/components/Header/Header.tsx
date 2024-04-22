import React, { useContext, useState } from 'react';
import { Box, Flex, Spacer, Button, Image, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import { AuthContext } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAdvancedSearch = () => {
    navigate('/advanced-search');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  const handleHome = () => {
    navigate('/');
    window.location.reload();
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen);
  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <Box bg="header" py={2}>
      
      <Flex align="center" maxW="1600px" mx="auto">
        <Box bg="header" flex="1" borderRadius="md" _hover={{ bg: 'whiteAlpha.200' }} py={2} px={4}>
          <Link to="/">
            <Box fontWeight="bold" fontSize={18} color="header" borderRadius={3} bg={"white"} padding={1}>
              Lore Library
            </Box>
          </Link>
        </Box>
        <Spacer flex="1" />
        <Box flex="55">  
          <Button flex="1" variant="ghost" onClick={handleHome} color="white" _hover={{ bg: 'whiteAlpha.200' }} mr={4}>
            Home
          </Button>
          <Button flex="1" variant="ghost" onClick={handleAdvancedSearch} color="white" _hover={{ bg: 'whiteAlpha.200' }} mr={4}>
            Advanced Search
          </Button>
        </Box>
        <Spacer flex="1" />
        <Flex align="center">
          <SearchBar />
          <Spacer ml={4} />
          {isAuthenticated ? (
            <Flex align="center">
              {isAdmin && (
                <Button variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }} mr={4}>
                  Site Settings
                </Button>
              )}
              <Menu isOpen={isMenuOpen} onClose={handleMenuClose}>
                <MenuButton as={Box} onClick={handleMenuOpen} cursor="pointer" mr={4}>
                  {user?.profilePicture ? (
                    <Image src={`${process.env.REACT_APP_API_URL}${user.profilePicture}`} alt="Profile" borderRadius="full" boxSize="60px" />
                  ) : (
                    <Image src={process.env.PUBLIC_URL + '/images/DefaultProfile.png'} alt="Default Profile" borderRadius="full" boxSize="60px" />
                  )}
                </MenuButton>
                <MenuList bg="background" color="white">
                  <MenuItem onClick={handleProfile} _hover={{ bg: 'whiteAlpha.200' }} bg="background">
                    Profile
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout} _hover={{ bg: 'whiteAlpha.200' }} bg="background">
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          ) : (
            <Box>
              <Box as={Link} to="/login" mr={4} color="white">
                Login
              </Box>
              <Box as={Link} to="/register" mr={4} color="white">
                Register
              </Box>
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;