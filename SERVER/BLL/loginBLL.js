const User = require('../models/User')

const getLogInUser = async (data) => {
   
    try {
        const result = await User.findOne({ username: data.username, password: data.password });
        if (!result) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }
       
        return result;
    } catch (e) {
        console.error('Error:', e);
        return null;
    }
};

module.exports = { getLogInUser };
