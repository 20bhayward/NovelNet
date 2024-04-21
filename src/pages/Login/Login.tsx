// Login.tsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { Box, Avatar, Grid, Divider, Heading, Text, Textarea, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      login(response.data.user, response.data.token);
      navigate('/profile');
    } catch (error : any) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('Server error');
      }
    }
  };

  return (
    <Box bg="background" minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <Box bg="subbackground" p={6} borderRadius="md" maxW="400px" width="100%">
        <Heading color="heading" as="h2" size="xl" textAlign="center" mb={4}>
          Login
        </Heading>
        {error && (
          <Text color="red.500" textAlign="center" mb={4}>
            {error}
          </Text>
        )}
        <form onSubmit={handleLogin}>
          <Box mb={4}>
            <FormControl>
              <FormLabel color="text" htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                color="text"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
          </Box>
          <Box mb={4}>
            <FormControl>
              <FormLabel color="text" htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                color="text"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </Box>
          <Button type="submit" colorScheme="blue" width="100%">
            Login
          </Button>
        </form>
        <Box mt={4} color="text" textAlign="center">
          <Link to="/register" color="text">
            Don't have an account? Register
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login; 