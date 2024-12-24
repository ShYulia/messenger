const Message = require ('../models/Message')
const mongoose = require('mongoose');

const clearNotifications = async(recipientId, senderId) =>{
try {
    await Message.updateMany({
        recipientId,
        senderId,
        isread:false},
        {$set:{isread:true}})
        return('done')
    }catch(e){
        console.log('error', e)
        return('error')
    }

}


module.exports = {clearNotifications}