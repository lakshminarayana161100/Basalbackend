const mongoose = require("mongoose");

// MongoDB Schema
const feedbackSchema = new mongoose.Schema({

 
    customerName: { type: String },
    feedback: { type: String, },
    date: { type: Date, default: Date.now },
    userid: { type: String, },
  });
  
  const Feedback = mongoose.model('Feedback', feedbackSchema);

  module.exports = Feedback;