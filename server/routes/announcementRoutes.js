// routes/announcementRoutes.ts
import express from 'express';
import Announcement from '../models/Announcement.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username profilePicture')
            .populate('updatedBy', 'username');
        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new announcement
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const newAnnouncement = new Announcement({
            ...req.body,
            createdBy: req.user._id,
        });
        const savedAnnouncement = await newAnnouncement.save();
        await savedAnnouncement.populate('createdBy', 'username profilePicture');
        res.status(201).json(savedAnnouncement);
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update an announcement
router.put('/:_id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            req.params._id,
            {
                ...req.body,
                updatedAt: Date.now(),
                updatedBy: req.user._id,
            },
            { new: true }
        )
            .populate('createdBy', 'username profilePicture')
            .populate('updatedBy', 'username');

        if (!updatedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json(updatedAnnouncement);
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Delete an announcement
router.delete('/:_id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params._id);

        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Pin an announcement
router.put('/:_id/pin', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const pinnedAnnouncement = await Announcement.findByIdAndUpdate(
            req.params._id,
            { pinned: true },
            { new: true }
        )
            .populate('createdBy', 'username profilePicture')
            .populate('updatedBy', 'username');

        if (!pinnedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json(pinnedAnnouncement);
    } catch (error) {
        console.error('Error pinning announcement:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;