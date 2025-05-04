const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//get all posts
router.get('/', async(req, res) => {
    try{
        const posts = await Post.find().populate('author', '_id name').sort('-createdAt');
        res.json(posts);
    }catch(error){
        res.status(500).json({error: 'Failed to fetch posts'})
    }
})

//Post new post
router.post('/', async(req, res) =>{
    const {title, content} = req.body;

    const post = new Post({
        title,
        content,
        author: req.user._id
    });

    try{
        await post.save();
        res.status(201).json(post);
    }catch(error){
        res.status(400).json({error: 'failed to create post'})
    }
});

module.exports = router;