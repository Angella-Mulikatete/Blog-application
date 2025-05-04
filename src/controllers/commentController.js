const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async(req, res) => {
    try{
        const {content , parentId} = req.body;

        const comment = new Comment({
            content,
            author: req.user.userId,
            post: req.params.postId,
            parentComment: parentId
        });

        await comment.save();

        //update post comments count
        await Post.findByIdAndUpdate(req.params.postId, {
            $inc: { commentCount: 1}
        });

        res.status(201).json(comment);
    }catch(error){
        res.status(500).json({
            error: 'Failed to create comment',
            details: error.message
        });
    }
}

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', '_id name')
            .populate('replies', '_id content author')
            .sort('-createdAt');

        res.json(comments);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch comments',
            details: error.message
        });
    }
};

exports.likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        
        if (comment.likes.includes(req.user.userId)) {
            // Remove like
            comment.likes.pull(req.user.userId);
        } else {
            // Add like
            comment.likes.push(req.user.userId);
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update comment likes',
            details: error.message
        });
    }
};