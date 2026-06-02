const postModel = require('../models/post.models');
const uploadfile = require('../services/storage.services');

const createPost = async (req, res) => {
    try {
        let imageUrl = "";
        if (req.file) {
            const result = await uploadfile(req.file.buffer);
            imageUrl = result.url;
        }

        const post = await postModel.create({
            image: imageUrl,
            caption: req.body.caption,
            authorId: req.user.userId,
            authorName: req.user.name // Saves username of creator
        });

        res.status(201).json({ message: "post created successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        // Sort to show newest first
        const posts = await postModel.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "posts fetched successfully", posts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};

const likePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userName = req.user.name; // Username from token
        const isLiked = post.likes.includes(userName);

        if (isLiked) {
            post.likes = post.likes.filter(name => name !== userName); // Unlike
        } else {
            post.likes.push(userName); // Like
        }

        await post.save();
        res.status(200).json({ message: "Like status updated", likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: "Error liking post", error: error.message });
    }
};

const commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await postModel.findById(req.params.id);
        
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (!text) return res.status(400).json({ message: "Comment text is required" });

        post.comments.push({
            username: req.user.name,
            text: text
        });

        await post.save();
        res.status(200).json({ message: "Comment added", comments: post.comments });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check karna ki logged-in user hi post ka malik hai
        if (post.authorId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You can only delete your own posts" });
        }

        await postModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error: error.message });
    }
};

module.exports = { createPost, getPosts, likePost, commentPost, deletePost };