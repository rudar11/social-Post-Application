const express = require('express');
const cookieparser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes'); // new post router

const app = express();

// Middlewares Setup
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000" , "https://social-post-application-dun.vercel.app"], // Frontend ports
    credentials: true
}));
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// --- HEALTH CHECK ROUTE (Server status check karne ke liye) ---
app.get('/', (req, res) => {
    res.send("<h1>Server is running! 🚀</h1>");
});

// --- ROUTES ---
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter); 

module.exports = app;