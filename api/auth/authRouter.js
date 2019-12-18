const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./authModel');
const generateToken = require('../../utils/generateToken')
const router = express.Router()
const bodyValidator = require('../../utils/validator')

router.post('/register', bodyValidator, (req, res) => { //endpoint to register
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 15)
    user.password = hash;

    db.addUser(user)
    .then(user => {
        const token = generateToken(user)        
        res.status(201).json({
            user,
            token: token
        })
    })
    .catch(error => {
        res.status(500).json({
            message: 'Couldnt register user: ' + error.message, data: error
        })
    })
})

module.exports = router;