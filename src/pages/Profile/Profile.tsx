import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, Avatar, VStack, useToast } from '@chakra-ui/react';
import ProfilePictureCropper from '../../components/ProfileImageCropper/ProfileImageCropper';

interface ProfileData {
  username: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  gender: string;
  location: string;
}

const Profile: React.FC = () => {
  const { user, isAuthenticated, login } = useContext(AuthContext);
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    profilePicture: '',
    firstName: '',
    lastName: '',
    gender: '',
    location: '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/users/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && file.type.match(/^image\/(jpeg|png)$/) && file.size <= 500 * 1024) {
      setProfilePicture(file);
      setIsCropperOpen(true);
    } else {
      alert('Please select a valid image file (JPG or PNG) with a maximum size of 500 KB.');
    }
  };

  const handleProfilePictureCrop = async (croppedImage: Blob) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', croppedImage, 'profile-picture.jpg');

      await api.put('/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Fetch the updated profile data
      const response = await api.get('/api/users/profile');
      setProfile(response.data);
      setIsCropperOpen(false);

      // Update the user state in the AuthContext
      const updatedUser = { ...user, profilePicture: response.data.profilePicture };
      login(updatedUser, localStorage.getItem('token') || '');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      await api.put('/api/users/change-password', {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };


  const handleSaveProfile = async () => {
    try {
      await api.put('/api/users/profile', {
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
        location: profile.location,
      });
      alert('Profile saved successfully');
      // Fetch the updated profile data
      const response = await api.get('/api/users/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <Box bg="background" minHeight="100vh" py={8}>
      <Box maxW="600px" mx="auto">
        <VStack spacing={6}>
          <Box bg="subbackground" p={6} borderRadius="md" w="100%">
            <Heading as="h2" size="xl" textAlign="center" mb={4} color="heading">
              Your Profile
            </Heading>
            <Box textAlign="center" mb={4}>
              <Avatar
                size="2xl"
                name={profile.username}
                src={profile.profilePicture ? `${process.env.REACT_APP_API_URL}${profile.profilePicture}` : ''}
                onClick={() => document.getElementById('profilePictureInput')?.click()}
                cursor="pointer"
              />
              <input
                id="profilePictureInput"
                type="file"
                accept=".jpg,.png"
                onChange={handleProfilePictureChange}
                style={{ display: 'none' }}
              />
              <Text fontSize="sm" color="subheading" mt={2}>
                Image must be a .jpg or .png
                <br />
                Max file size is 500 KB
              </Text>
            </Box>
            <FormControl id="username" mb={4}>
              <FormLabel color="subheading">Username</FormLabel>
              <Input
                type="text"
                bg="button"
                color="text"
                value={profile.username}
                onChange={(event) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    username: event.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl id="firstName" mb={4}>
              <FormLabel color="subheading">First Name</FormLabel>
              <Input
                type="text"
                bg="button"
                color="text"
                value={profile.firstName}
                onChange={(event) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    firstName: event.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl id="lastName" mb={4}>
              <FormLabel color="subheading">Last Name</FormLabel>
              <Input
                type="text"
                bg="button"
                color="text"
                value={profile.lastName}
                onChange={(event) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    lastName: event.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl id="gender" mb={4}>
              <FormLabel color="subheading">Gender</FormLabel>
              <Input
                type="text"
                bg="button"
                color="text"
                value={profile.gender}
                onChange={(event) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    gender: event.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl id="location" mb={4}>
              <FormLabel color="subheading">Location</FormLabel>
              <Input
                type="text"
                bg="button"
                color="text"
                value={profile.location}
                onChange={(event) =>
                  setProfile((prevProfile) => ({
                    ...prevProfile,
                    location: event.target.value,
                  }))
                }
              />
            </FormControl>
            <Button colorScheme="blue" onClick={handleSaveProfile} w="100%" bg="button" _hover={{ bg: "blue.600" }}>
              Save Profile
            </Button>
          </Box>
          <Box bg="subbackground" p={6} borderRadius="md" w="100%">
            <Heading as="h3" size="lg" textAlign="center" mb={4} color="heading">
              Change Password
            </Heading>
            <FormControl id="currentPassword" mb={4}>
              <FormLabel color="subheading">Current Password</FormLabel>
              <Input
                type="password"
                bg="button"
                color="white"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </FormControl>
            <FormControl id="newPassword" mb={4}>
              <FormLabel color="subheading">New Password</FormLabel>
              <Input
                type="password"
                bg="button"
                color="white"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" onClick={handleChangePassword} w="100%" bg="button" _hover={{ bg: "blue.600" }}>
              Change Password
            </Button>
          </Box>
          <Button
            as={Link}
            to={`/profile/${user?.uniqueId}`}
            colorScheme="teal"
            w="100%"
            bg="button"
            _hover={{ bg: "teal.600" }}
          >
            View Public Profile
          </Button>
        </VStack>
      </Box>
      {isCropperOpen && profilePicture && (
        <ProfilePictureCropper
          image={URL.createObjectURL(profilePicture)}
          onCrop={handleProfilePictureCrop}
          onCancel={() => setIsCropperOpen(false)}
        />
      )}
    </Box>
  );
};
export default Profile; 