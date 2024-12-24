const User = require('../models/User')


const getUsers = async ()=>{
    const users = await User.find({})

    return users
}
module.exports = {getUsers}