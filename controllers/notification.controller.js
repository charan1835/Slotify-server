import Notification from '../models/Notification.js';

// Get all notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 notifications

        // Count unread
        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            read: false
        });

        res.status(200).json({ notifications, unreadCount });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
};

// Mark a single notification as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: req.user._id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { read: true }
        );

        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOneAndDelete({
            _id: id,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Internal Helper to create notification
export const createNotification = async ({ recipient, message, type, relatedId, relatedModel }) => {
    try {
        await Notification.create({
            recipient,
            message,
            type,
            relatedId,
            relatedModel
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        // Don't throw, just log. Notification failure shouldn't fail the main action.
    }
};
