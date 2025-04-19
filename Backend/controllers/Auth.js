import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModal from '../models/User.js';
import { upload } from '../middleware/Multer.js';

import { FileUploadeToColoudinary } from '../libs/Cloudinary.js';

const Register = async (req, res) => {
    try {
        const { FullName, email, password } = req.body;

        // Optional chaining prevents crash if file isn't uploaded
        const imagePath = req.file?.filename || '';

        console.log("Uploaded image filename:", imagePath);

        const existUser = await UserModal.findOne({ email });
        if (existUser) {
            return res.status(301).json({ success: false, message: "User already exists, please login." });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new UserModal({
            FullName,
            email,
            password: hashedPassword,
            profile: imagePath, // Save filename or cloudinary URL
        });

        await newUser.save();

        // Optional: Delete file after upload to Cloudinary
        // fs.unlinkSync(`uploads/${imagePath}`);

        res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Error during registration' });
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const FindUser = await UserModal.findOne({ email });
        if (!FindUser) {
            return res.status(404).json({ success: false, message: "Account not found. Please register." });
        }

        const isMatch = await bcrypt.compare(password, FindUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ userId: FindUser._id }, process.env.JWT_SECRET);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // should be true in production with HTTPS
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        res.status(200).json({ success: true, message: "Login successful", user: FindUser, token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const Logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { FullName, oldpassword, newpassword } = req.body;

        const ExistUser = await UserModal.findById(userId);
        if (!ExistUser) {
            return res.status(404).json({ success: false, message: "Account not found." });
        }

        if (oldpassword) {
            const isOldPasswordValid = await bcrypt.compare(oldpassword, ExistUser.password);
            if (!isOldPasswordValid) {
                return res.status(401).json({ success: false, message: "Old password is incorrect." });
            }
        }

        if (FullName) {
            ExistUser.FullName = FullName;
        }

        if (oldpassword && newpassword) {
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            ExistUser.password = hashedPassword;
        } else if (oldpassword && !newpassword) {
            return res.status(400).json({ success: false, message: "New password is required when old password is provided." });
        }

        await ExistUser.save();

        res.status(200).json({ success: true, message: "Profile updated successfully", user: ExistUser });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { Register, Login, Logout, updateProfile };
