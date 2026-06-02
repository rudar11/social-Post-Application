const usermodel = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    try {
        const { email, name, password } = req.body;

        const isExists = await usermodel.findOne({ email });
        if (isExists) {
            return res.status(409).json({ message: "user already existed" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await usermodel.create({ email, name, password: hash });

        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "3d" }
        );

        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
        res.status(201).json({ message: "user created successfully", user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await usermodel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "invalid email or password" });
        }

        const isPasswordvalid = await bcrypt.compare(password, user.password);
        if (!isPasswordvalid) {
            return res.status(401).json({ message: "invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "3d" }
        );

        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
        res.status(200).json({ message: "user logged in successfully", user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports = { registerUser, loginUser };