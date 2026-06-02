
const express = require('express');
const cookieparser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const authRouter = require('./routes/auth.routes');
const postModel = require('./models/post.models');
const uploadfile = require('./services/storage.services');
const isAuthenticated = require('./middleware/auth.milleware'); // Teri file ka naam yahi rakha hai

const app = express();

// Middlewares Setup
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Frontend ports
    credentials: true
}));
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ storage: multer.memoryStorage() });

// --- ROUTES ---

// 1. Auth Routes
app.use('/api/auth', authRouter);

// 2. Post Routes (Requires Login)
app.post('/api/posts', isAuthenticated, upload.single("image"), async function (req, res) {
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
});

// 3. Get All Posts (Feed)
app.get('/api/posts', async (req, res) => {
    try {
        // Sort to show newest first
        const posts = await postModel.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "posts fetched successfully", posts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
});

// 4. Like / Unlike a Post
app.post('/api/posts/:id/like', isAuthenticated, async (req, res) => {
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
});

// 5. Comment on a Post
app.post('/api/posts/:id/comment', isAuthenticated, async (req, res) => {
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
});

// 6. Delete a Post (YE NAYA ROUTE ADD KIYA HAI)
app.delete('/api/posts/:id', isAuthenticated, async (req, res) => {
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
});

module.exports = app;