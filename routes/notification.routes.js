import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { protect as auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(auth); // Protect all notification routes

router.get('/', notificationController.getUserNotifications);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;
