const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating a user"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address"],
        unique: [true, "email already exists"]
    },
    name: {
        type: String,
        required: [true, "name is required for creating a user"],
    },
    password: {
        type: String,
        required: [true, "Password is required for creating an account"],
        minlength: [6, "password should contain more than 6 character"],
        select: false
    }
}, { timestamps: true });

const usermodel = mongoose.model("user", userSchema);
module.exports = usermodel;