const mongoose = require('mongoose');

// Assignment Requirement: Track user, likes, and comments
const postSchema = new mongoose.Schema({
    image: {
        type: String
    },
    caption: {
        type: String
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    likes: [
        { type: String } // Save usernames of people who liked
    ],
    comments: [
        {
            username: { type: String, required: true }, // Username of commenter
            text: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const postModel = mongoose.model("Post", postSchema);
module.exports = postModel;