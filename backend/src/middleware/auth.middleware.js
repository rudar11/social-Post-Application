const jwt = require('jsonwebtoken');

// Ye middleware check karega ki user logged in hai ya nahi post/like karne se pehle
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Please login to access this resource" });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData; // Contains { userId, name, email }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = isAuthenticated;