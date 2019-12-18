function bodyValidator (req, res, next) {
    if(Object.keys(req.body).length) {
        if(req.body.username && req.body.password) {
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