import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { Box, Button, FormControl, FormLabel, Input, Select, Text, VStack } from '@chakra-ui/react';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/register', { username, password, role });
      const { token, user } = response.data;
      // Store the token in local storage or an HTTP-only cookie
      localStorage.setItem('token', token);
      // Update the user state or context
      setUser(user);
      setIsAuthenticated(true);
      navigate('/profile');
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('Server error');
      }
    }
  };

  return (
    <Box
      bg="background"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bg="subbackground"
        p={6}
        borderRadius="md"
        maxW="400px"
        w="100%"
        color="white"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Register
        </Text>
        {error && (
          <Text color="red.500" mb={4} textAlign="center">
            {error}
          </Text>
        )}
        <form onSubmit={handleRegister}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="User">User</option>
                <option value="Creator">Creator</option>
                <option value="Admin">Admin</option>
              </Select>
            </FormControl>
            <Button type="submit" colorScheme="blue" width="100%">
              Register
            </Button>
          </VStack>
        </form>
        <Box mt={4} textAlign="center">
          <Link to="/login" style={{ color: 'blue.400' }}>
            Already have an account? Login
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;