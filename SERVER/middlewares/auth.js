const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async(req,res,next) => {
    const token= req.headers['authorization']
    if (!token) return res.status(401).send('Access denied. No token provided')
        try {
    const ACCESS_SECRET_TOKEN = process.env.SECRET_KEY
    const decoded = jwt.verify(token, ACCESS_SECRET_TOKEN)
    req.user = decoded
    next()
}catch(e) {
    console.log('invalid token', e)
    return res.status(401).send('Invalid Token')
}
}