const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateAuthToken = function() {
    // Use process.env.JWTPRIVATEKEY for the secret key
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY);
    return token;
};

// Route for user login
router.post("/", async (req, res) => {
    try {
        // Validate the request body
        const { error } = validate(req.body);
        if (error) {
            // Return validation error details
            return res.status(400).send({ message: "Validation failed", error: error.details.map(detail => detail.message) });
        }

        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Return unauthorized if user is not found
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            // Return unauthorized if password is invalid
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        // Generate and send JWT token on successful login
        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Logged in successfully" });

    } catch (error) {
        // Log and handle internal server errors
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Function to validate user input
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });

    return schema.validate(data);
};

module.exports = router;
