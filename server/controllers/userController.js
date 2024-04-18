import bcrypt from 'bcrypt';
import User from '../models/User.js';
import path from 'path';
import fs from 'fs';
import Manga from '../models/Manga.js';
import Comment from '../models/Comment.js';

const profilePicturesDir = path.join(path.resolve(), 'uploads', 'profile-pictures');

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
      profilePicture: user.profilePicture,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      location: user.location,
      uniqueId: user.uniqueId,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.session.currentUser.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req._id;
  const { firstName, lastName, gender, location } = req.body;
  const username = req.body.username || '';

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.gender = gender || user.gender;
    user.location = location || user.location;

    if (req.file) {
      // Move the uploaded file to the persistent directory
      const originalPath = req.file.path;
      const extension = path.extname(req.file.originalname);
      const newFileName = `${userId}${extension}`;
      const newFilePath = path.join(profilePicturesDir, newFileName);

      // Create the directory if it doesn't exist
      fs.mkdirSync(profilePicturesDir, { recursive: true });

      // Move the file to the new location
      fs.renameSync(originalPath, newFilePath);

      // Store the new file path in the database
      user.profilePicture = `/uploads/profile-pictures/${newFileName}`;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

};
export const followManga = async (req, res) => {
  try {
    const userId = req.params.userId;
    const mangaId = req.params.mangaId;

    const user = await User.findOne(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const manga = await Manga.findOne({ id: mangaId });
    if (!manga) {
      return res.status(404).json({ message: 'Manga not found' });
    }

    if (!user.followedManga.includes(manga._id)) {
      user.followedManga.push(manga._id);
      await user.save();
    }

    res.json({ message: 'Manga followed successfully' });
  } catch (error) {
    console.error('Error following manga:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const favoriteManga = async (req, res) => {
  try {
    const userId = req.params.userId;
    const mangaId = req.params.mangaId;

    const user = await User.findOne(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const manga = await Manga.findOne({ id: mangaId });
    if (!manga) {
      return res.status(404).json({ message: 'Manga not found' });
    }

    if (!user.favoriteManga.includes(manga._id)) {
      user.favoriteManga.push(manga._id);
      await user.save();
    }

    res.json({ message: 'Manga favorited successfully' });
  } catch (error) {
    console.error('Error favoriting manga:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const readingManga = async (req, res) => {
  try {
    const userId = req.params.userId;
    const mangaId = req.params.mangaId;

    const user = await User.findOne(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const manga = await Manga.findOne({ id: mangaId });
    if (!manga) {
      return res.status(404).json({ message: 'Manga not found' });
    }

    if (!user.readingManga.includes(manga._id)) {
      user.readingManga.push(manga._id);
      await user.save();
    }

    res.json({ message: 'Manga added to reading list' });
  } catch (error) {
    console.error('Error marking manga as reading:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfileComments = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const comments = await Comment.find({ profileId: uniqueId }).exec();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching profile comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitProfileComment = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const { commenterUniqueId, commenterUsername, comment } = req.body;
    const newComment = new Comment({
      uniqueId: commenterUniqueId,
      username: commenterUsername,
      comment,
      profileId: uniqueId,
    });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error submitting profile comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserManga = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('followedManga favoriteManga readingManga');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      followedManga: user.followedManga,
      favoriteManga: user.favoriteManga,
      readingManga: user.readingManga,
    });
  } catch (error) {
    console.error('Error fetching user manga:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};