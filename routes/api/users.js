const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Gravator = require('gravatar');
const Bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   GET api/users
//@desc     Test route
//@access   Public

router.get('/api/users', (req, res) => {
    console.log(req.body);
    res.send('User route');
});


router.post('/api/users/', [
    check('name','Please Enter Valid name').not().isEmpty(),
    check('email','Please Enter Email').isEmail(),
    check('password','Please Enter Password').isLength({ min: 5 })
],
    async (req, res) => {

        const error = validationResult(req);
        if (!error.isEmpty()) {
            await res.status(400).json({ errors: error.array() })
        }

        //await console.log(req.body); 
        //res.send(JSON.stringify(req.body));
        try {
            const { name, email, password } = req.body;
            //see if user exits
            let Isuser = await User.findOne({ email });
            if (Isuser) {
               return res.status(400).json({ errors: "Email already exists" });
            }

            //Get users gravtar
            let avatar = Gravator.url(email, { s: '200', r: 'pg', d: '404' });

            //create new User
            user = new User({
                name,
                email,
                avatar,
                password
            })

            //Encrpt Password
            let salt = await Bcryptjs.genSalt(10);
            user.password = await Bcryptjs.hash(password, salt);

            //Save User
            await user.save();
            //res.send("User registered");

            //return jsonwebtoken
            const payLoad = {
                user: {
                    id: user.id,
                    email: user.email
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
            console.log("Server error")
            res.send("Server Error");
        }
    })

module.exports = router;