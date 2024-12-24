const express= require("express")
const loginBLL= require('../BLL/loginBLL')
require('dotenv').config({path:".env"})
const jwt = require('jsonwebtoken')

const router = express.Router()
router.route("/").post(async(req,res) => {
    const data = req.body
    const userData = await loginBLL.getLogInUser(data)
    if (userData !==  null ) {
        
        const accessToken = jwt.sign({id:userData.id}, process.env.SECRET_KEY)
        const result = {
            accessToken:accessToken,
            _id:userData._id,
            username:userData.username
        }
       
        res.json(result)
    }else res.status(401).send('error')})
    module.exports = router