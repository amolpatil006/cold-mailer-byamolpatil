import User from "../model/auth.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    // Implementation for user registration
    try {
        const { name, email, password, domain, skills } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Please provide all required fields" 
            });
        }
        if(password.length < 8) {
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 8 characters long" 
            });
        }
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "User already exists" 
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            domain,
            skills
        });
        await user.save();
        return res.status(201).json({ 
            success: true,
            message: "User registered successfully" ,
            user
        });
    } 
    catch (error) 
    {
        console.error("Error registering user:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};

export const loginUser = async (req, res) => {
    // Implementation for user login
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Please provide all required fields" 
            });
        }
        const user = await User.findOne({ email }).select("+password");
        if(!user) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            console.log();
            return res.status(400).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        return res.status(200).json({ 
            success: true,
            message: "User logged in successfully" ,
            user,
            token
        });             
    } 
    catch (error) 
    {
        console.error("Error logging in user:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};