const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const cors = require('cors');

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const feedbackRoute = require("./routes/feedback");
mongoose.connect('mongodb+srv://lakshminarayana:narayana@cluster0.ewnrqzl.mongodb.net/?retryWrites=true&w=majority', {
    
}).then(
    () => console.log('DB connected..... ')
).catch(err => console.log(err))



app.use(bodyParser.json({ limit: "250mb" }));
app.use(bodyParser.urlencoded({ limit: "250mb", extended: true, }));

// middlewares
app.use(express.json());
app.use(cors());


// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/feedback", feedbackRoute);


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));


module.exports = app;