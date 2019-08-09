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

router.put('/like/:pid', auth, async (req, res) => {

    try {

        let post = await Post.findOne({ _id: req.params.pid });

        let likes = post.likes.filter(x => x.user.toString() === req.user.id);
        if (likes.length > 0) {
            return res.send("Post already liked")
        }
        else {
            post.likes.unshift({ user: req.user.id });
            await post.save();
            return res.send("Post liked");
        }

    } catch (error) {
        res.send("Something went wrong");
    }
})

router.delete('/unlike/:pid', auth, async (req, res) => {
    try {
        let post = await Post.findOne({ _id: req.params.pid });

        let likes = post.likes.filter(x => x.user.toString() === req.user.id);

        if (likes.length > 0) {
            post.likes.splice(0, 1);
            post.save();
            return res.send("Likes removed");
        }
        else {
            return res.send("Post already unliked")
        }

    } catch (error) {
        res.send("Something went wrong");
    }
});


router.put('/comments/:pid',
    [
        auth,
        [
            check('text', 'Please enter text').not().isEmpty()
        ]
    ],
    async (req, res) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json(error.array());
        }

        try {
            let post = await Post.findOne({ _id: req.params.pid });

            let user = await User.findOne({ _id: req.user.id });

            post.comments.unshift({ user: req.user.id, text: req.body.text, name: user.name, avatar: user.avatar });
            await post.save();
            res.send("Comments Saved!");

        } catch (error) {
            res.send("Something went wrong");
        }
    })

router.delete('/delcomment/:pid/:cid', auth, async (req, res) => {
    try {
        let post = await Post.findOne({ _id: req.params.pid });
        let cindex = post.comments.map(x => x._id).indexOf(req.params.cid);
        
        if (cindex !== -1) {
            post.comments.splice(cindex, 1);
            await post.save();
            return res.send("Comments Deleted");
        }
        else {
            return res.send("No comments avilable");
        }
    } catch (error) {
        res.send("Something went wrong");
    }
})


module.exports = router;