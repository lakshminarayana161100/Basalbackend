//first import the express
const express = require("express");
//define the router
const router = express.Router();
//import the schema here
const Feedback = require('../models/feedback');



router.post('/feedbackpost', async (req, res, next) => {        // want to create product details
    const feedbackpost = new Feedback({
        customerName: req.body.customerName,
        feedback: req.body.feedback,
        userid: req.body.userid

    });
    await feedbackpost.save()
    res.status(200).json({
        status: 'success',
        postfeedback: feedbackpost
    })


})


//get feedback
router.get('/allfeedback', async (req, res) => {
    try {
        const feedback = await Feedback.find()
        res.status(200).json({
            TotalFeedback: feedback.length,
            feedback
        })
    } catch (error) {
        res.status(401).send(error)
    }
});

router.get("/read/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Feedback.findById({ _id: id });
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

router.put('/updatefeedback/:id', async (req, res) => {
    const updates = Object.keys(req.body) //keys will be stored in updates ==> req body fields
    const allowedUpdates = ['customerName', 'feedback'] // updates that are allowed
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // validating the written key in req.body with the allowed updates
    if (!isValidOperation) {
        console.log(isValidOperation)
        return res.status(400).json({ error: 'invalid updates' })
    }
    try { // used to catch errors
        const feedback = await Feedback.findOne({ _id: req.params.id }) //finding the feedback based on id
        if (!feedback) {
            return res.status(404).json({ message: 'Invalid feedback' }) //error status
        }
        updates.forEach((update) => feedback[update] = req.body[update]) //updating the value

        await feedback.save()
        res.status(200).json({
            updatedFeedback: feedback
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete('/detelefeedback/:id', async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete({ _id: req.params.id })
        if (!deletedFeedback) {
            return res.status(404).json({ error: "feedback not found" })

        }
       return res.status(400).json({
            message: "feedback Deleted",
            deletedFeedback
        })
    } catch (error) {
       return res.status(400).send(error)
    }

})

module.exports = router;