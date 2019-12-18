function bodyValidator (req, res, next) { // function to validate email and password
    if(Object.keys(req.body).length) {
        if(req.body.email && req.body.password) {
            next()
        } else {
            res.status(400).json({
                message: "missing required field"
            })
        }
    } else {
        res.status(400).json({
            message: "missing required data"
        })
    }
}

module.exports = bodyValidator;