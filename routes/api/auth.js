const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authToken = require('../../middleware/auth');
const User = require('../../models/User');
const Bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   GET api/auth
//@desc     Test route
//@access   Public

//router.get('/api/auth', authToken, (req, res) => res.send('User auth'));

router.get('/api/auth', authToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (error) {
        console.log(err.message);
        res.status(500).send('Server Eroor');
    }
});

router.post('/api/auth/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
    async (req, res) => {

        const error = validationResult(req);
        if (!error.isEmpty()) {
            await res.status(400).json({ errors: error.array() })
        }

        //await console.log(req.body); 
        //res.send(JSON.stringify(req.body));
        try {
            const { email, password } = req.body;
            //see if user exits

            let Isuser = await User.findOne({ email });

            if (!Isuser) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credential" }] });
            }

            const isMatch = await Bcryptjs.compare(password, Isuser.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credential" }] });
            }

            //console.log(user)
            //return jsonwebtoken
            const payLoad = {
                user: {
                    id: Isuser.id,
                    email: Isuser.email
                }
            }

            jwt.sign(
                payLoad,
                config.get('jwtToken'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err)
                        throw err;

                    res.json({ token });
                }
            );

            //res.send(req.body);

        } catch (error) {
            res.send("Server Error");
        }
    })


module.exports = router;