const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const request = require('request');


// @route   GET api/profile/me
//@desc     Test route
//@access   Public

router.get('/api/profile/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        //console.log(profile);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);

    } catch (error) {
        console.log(error.message);
        res.status(400).send('Server Error')
    }

});

// @route   Post api/profile
//@desc     Save route
//@access   Public

router.post('/api/profile/',
    [
        auth,
        [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills Required').not().isEmpty()
        ]
    ],
    async (req, res) => {

        const error = validationResult(req);
        if (!error.isEmpty()) {
            await res.status('400').json({ errors: error.array() });
        }

        const { company, website, location, status, skills, bio, githubusername, youtube, twitter, facebook, linkedin, instagram } = req.body;

        const ProfileFields = { user: req.user.id, company, website, location, status, skills, bio, githubusername };
        // ProfileFields.user = req.user.id
        // if (company) (ProfileFields.company) = company;
        // if (website) (ProfileFields.website) = website;
        // if (location) (ProfileFields.location) = location;
        // if (status) (ProfileFields.status) = status;
        // if (skills) (ProfileFields.skills) = skills.split(',');
        // if (bio) (ProfileFields.bio) = bio;
        // if (githubusername) (ProfileFields.githubusername) = githubusername;

        ProfileFields.social = { youtube, twitter, facebook, linkedin, instagram };
        // if (youtube) (ProfileFields.social.youtube) = youtube;
        // if (twitter) (ProfileFields.social.twitter) = twitter;
        // if (facebook) (ProfileFields.social.facebook) = facebook;
        // if (linkedin) (ProfileFields.social.linkedin) = linkedin;
        // if (instagram) (ProfileFields.social.instagram) = instagram;


        try {
            let isProfile = await Profile.findOne({ user: req.user.id });

            if (isProfile) {
                let update = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    {
                        $set: ProfileFields
                        // $set: { company, website, location, status, skills, bio, githubusername, youtube, twitter, facebook, linkedin, instagram }
                    },
                    { new: true }
                )

                return res.send("Profile Updated");
            }
            else {
                let profile = new Profile(ProfileFields);
                // let profile = new Profile({ company, website, location, status, skills, bio, githubusername, youtube, twitter, facebook, linkedin, instagram });

                await profile.save();

                res.send("Profile Saved Succesfully");
            }

        } catch (error) {
            res.status(400).json({ error: "Something Went Wrong" })
        }
    }
);

//@route   GET api/profile/me
//@desc     Get All Profiles
//@access   Public

router.get('/api/profile/all', auth, async (req, res) => {
    try {
        let lstProfile = await Profile.find().populate('user', ['name', 'avatar']);
        res.send(lstProfile);
    } catch (error) {
        res.status(400).json({ error: "Something Went Wrong" })
    }
})

router.get('/api/profile/:pid', auth, async (req, res) => {
    try {

        //let profile = await Profile.findOne({ user: req.params.pid })
        let profile = await Profile.findById({ _id: req.params.pid });

        res.send(profile);
    } catch (error) {
        res.status(400).json({ error: "Something Went Wrong" })
    }
})

router.delete('/api/profile/delete', auth, async (req, res) => {
    try {
        let msg;

        await Profile.deleteOne({ user: req.user.id });
        msg = "Profile Deleted";

        await User.delete({ _id: req.user.id });
        res.send(`${msg} User Deleted`);

    } catch (error) {
        res.status(400).json({ error: "Something Went Wrong" })
    }
})

//@route   Update api/profile/me
//@desc     Update Experiance Profiles
//@access   Public

router.put('/api/profile/exp',
    [
        auth,
        [
            check('title', 'Please Enter Title').not().isEmpty(),
            check('company', 'Please Enter Title').not().isEmpty(),
            check('_from', 'Please enter from date').not().isEmpty(),
            check('current', 'please enter currency').isBoolean()
        ]
    ], async (req, res) => {
        try {

            const error = validationResult(req);
            if (!error.isEmpty()) {
                await res.status('400').json({ errors: error.array() });
            }

            const { title, company, location, to, _from, description } = req.body;
            let ss = { title, company, location, to, _from, description };

            let profile = await Profile.findOne({ user: req.user.id });
            profile.experiance.unshift(ss);


            await profile.save();

            res.send("Experiance Updated");
        } catch (err) {
            res.status(400).json({ error: "Something went wrong" });
        }
    })

router.delete('/api/profile/expDelete/:delID', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id });

        const expIndex = profile.experiance.map(x => x.id).indexOf(req.params.delID);

        profile.experiance.splice(expIndex, 1);

        await profile.save();

        res.send("Experiance deleted!");
    } catch (error) {
        res.send("Something went wrong");
    }
})

router.get('/api/profile/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('GitClientID')}&client_secret=${config.get('GitClientSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(options, (error, response, body) => {

            if (error)
                console.log(error)

            if (response.statusCode !== 200)
                res.status(404).json({ msg: 'No git hub Profile found' });


            res.send(JSON.parse(body));
        })
    } catch (error) {
        res.send('Something Went Wrong');
    }

});


module.exports = router;