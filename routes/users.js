// Import required modules
const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
require('dotenv').config();

// Handle user registration
router.post("/", async (req, res) => {
    try {
        // Validate the request body
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        // Check if user with the provided email already exists
        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res
                .status(409)
                .send({ message: "User with given email already exists!" });

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Save the user with the hashed password
        await new User({ ...req.body, password: hashPassword }).save();
        
        // Send success response
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        // Handle server-side errors
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Handle user login
router.post("/login", async (req, res) => {
    try {
        // Validate the request body
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ message: "Email and password are required" });
        }

        // Find the user with the provided email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password in the database
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        // If the password is valid, consider the user authenticated
        // You might generate a JWT token here and send it back to the client for authentication

        // Send success response with user data
        res.status(200).send({ message: "Login successful", data: user });
    } catch (error) {
        // Handle server-side errors
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Export the router for use in other modules
module.exports = router;
