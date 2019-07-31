const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');


// @route   GET api/profile/me
//@desc     Test route
//@access   Public

router.get('/api/profile/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        console.log(profile);

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

router.post('/api/profile/', [auth,
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

        // const ProfileFields = {};
        // ProfileFields.user = req.user.id
        // if (company) (ProfileFields.company) = company;
        // if (website) (ProfileFields.website) = website;
        // if (location) (ProfileFields.location) = location;
        // if (status) (ProfileFields.status) = status;
        // if (skills) (ProfileFields.skills) = skills.split(',');
        // if (bio) (ProfileFields.bio) = bio;
        // if (githubusername) (ProfileFields.githubusername) = githubusername;

        // ProfileFields.social = {};
        // if (youtube) (ProfileFields.social.youtube) = youtube;
        // if (twitter) (ProfileFields.social.twitter) = twitter;
        // if (facebook) (ProfileFields.social.facebook) = facebook;
        // if (linkedin) (ProfileFields.social.linkedin) = linkedin;
        // if (instagram) (ProfileFields.social.instagram) = instagram;

        //console.log(ProfileFields);
        try {
            let isProfile = await Profile.findOne({ user: req.user.id });

            console.log(isProfile)
            if (isProfile) {
                let update = await Profile.findOneAndUpdate({ user: req.user.id },
                    {
                        //$set:  ProfileFields
                        $set: { company, website, location, status, skills, bio, githubusername, youtube, twitter, facebook, linkedin, instagram }
                    },
                    { new: true }
                )

                return res.send("Profile Updated");
            }
            else {
                //let profile = new Profile( ProfileFields);
                let profile = new Profile({ company, website, location, status, skills, bio, githubusername, youtube, twitter, facebook, linkedin, instagram });

                await profile.save();

                res.send("Profile Saved Succesfully");
            }

        } catch (error) {
            res.status(400).json({ error: "Something Went Wrong" })
        }
    }
)


module.exports = router;