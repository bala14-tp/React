const express = require('express');
const router = express.Router();

// @route   GET api/auth
//@desc     Test route
//@access   Public

router.get('/api/auth', (req, res) => res.send('User auth'));

router.post('/api/auth', (req, res) => {
    res.send("User Auth authicate");
}
)

module.exports = router;