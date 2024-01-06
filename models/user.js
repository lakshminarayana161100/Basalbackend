// Import required modules
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Define the MongoDB Schema for user
const userSchema = new mongoose.Schema({
    firstName: { type: String }, // User's first name
    lastName: { type: String }, // User's last name
    email: { type: String }, // User's email
    password: { type: String }, // User's password
    userType: { type: String }, // Type of user (e.g., admin, regular user)
});

// Method to generate authentication token for the user
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d", // Token expiration time set to 7 days
    });
    return token;
};

// Create a Mongoose model based on the defined schema
const User = mongoose.model("user", userSchema);

// Validation function for user data using Joi
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        userType: Joi.string().required().label("User Type"),
    });
    return schema.validate(data);
};

// Export the User model and validation function for use in other modules
module.exports = { User, validate };
