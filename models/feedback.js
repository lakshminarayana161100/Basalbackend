// Import Mongoose for MongoDB interaction
const mongoose = require("mongoose");

// Define the MongoDB Schema for feedback
const feedbackSchema = new mongoose.Schema({
    // Define the schema fields for customer feedback
    customerName: { type: String }, // Customer's name
    feedback: { type: String }, // Feedback content
    date: { type: Date, default: Date.now }, // Date of the feedback (default to current date)
    userid: { type: String }, // User ID associated with the feedback
});

// Create a Mongoose model based on the defined schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Export the Feedback model for use in other modules
module.exports = Feedback;
