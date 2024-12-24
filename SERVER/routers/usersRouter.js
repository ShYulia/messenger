const express = require("express");
const auth = require('../middlewares/auth')
const jwt = require("jsonwebtoken");
const usersBLL = require('../BLL/usersBLL')
require('dotenv').config({path:".env"})
const router = express.Router();

router.get('/' ,auth, async(req,res) =>{

    try{
    const users = await usersBLL.getUsers()
    
    res.json(users)
    }catch(e) {
        console.log(e)
        res.status(400).json('Error!')
    } 

})
module.exports = router