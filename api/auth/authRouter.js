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

router.post('/login', bodyValidator, (req, res) => {
    let {username, password} = req.body;

    db.getUserBy({username})
    .then( user => {
        if(user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user)
            res.status(200).json({
                token: token
            })
        } else {
            res.status(400).json({
                message: 'Invalid password!'
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Internal server error' + error.message
        })
    })
})

module.exports = router;