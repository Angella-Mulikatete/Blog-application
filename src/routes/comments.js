const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.post('/:postId/comments', protect, commentController.createComment);
router.get('/:postId/comments', commentController.getComments);
router.put('/:commentId/like', protect, commentController.likeComment);

module.exports = router;