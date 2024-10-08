// Import express
const express = require("express");

// Import validationResult from express-validator
const { validationResult } = require("express-validator");

// Import bcrypt
const bcrypt = require("bcryptjs");

// Import jsonwebtoken
const jwt = require("jsonwebtoken");

// Import prisma client
const prisma = require("../prisma/client");

// Function login
const login = async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    const { email, password } = req.body; // Destructure for clarity

    try {
        // Find user
        const user = await prisma.user.findFirst({
            where: { email },
            select: { id: true, name: true, email: true, password: true },
        });

        // User not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Compare password
        const validPassword = await bcrypt.compare(password, user.password);

        // Password incorrect
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Destructure to remove password from user object
        const { password: _, ...userWithoutPassword } = user; // Use _ for unused variable

        // Return response
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { login };
