const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/post');
const auth = require('../../middleware/auth');

// @route   GET api/post
//@desc     Test route
//@access   Public

router.get('/', (req, res) => res.send('User post'));


// @route   Post api/post
//@desc     Post route
//@access   Public

router.post('/addposts',
    [
        auth,
        [
            check('text', 'please enter text').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        try {

            const userdata = await User.findById(req.user.id).select("-password");

            const newPost = new Post({
                user: req.user.id,
                name: userdata.name,
                avatar: userdata.avatar,
                text: req.body.text
            });

            await newPost.save();

            res.send("Post Saved Succesfully!");

        } catch (error) {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
)

router.get('/showPost', auth, async (req, res) => {
    try {
        const po = await Post.find({ user: req.user.id });
        res.send(po);

    } catch (error) {
        res.send("Something Went Wrong");
    }
});

router.delete('/deletePost/:delID', auth, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.delID });

        res.send("Record Deleted!");
    } catch (error) {
        res.send("Something went wrong");
    }
})

module.exports = router;