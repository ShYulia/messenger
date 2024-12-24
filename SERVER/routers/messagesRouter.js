const express = require('express')
const messagesBLL = require('../BLL/messagesBLL')
const router = express.Router()

const Message = require('../models/Message')

router.get('/:userId/:otherUserId', async(req,res)=>{
    const {userId, otherUserId} = req.params
 
    try{
        const messages = await Message.find({
            type:'user',
            $or:[
                {senderId:userId, recipientId:otherUserId},
                {senderId:otherUserId,recipientId:userId}
            ]
        })
        .sort({timestamp:-1})
        .limit(20)
        res.json(messages)
    }catch(e){
        res.status(500).json( {error:'error fetching messages'})
    }
})
router.put('/:recipientId/:senderId', async(req,res)=>{
    const {recipientId, senderId} = req.params
    try {
        const response = await messagesBLL.clearNotifications(recipientId, senderId)
        res.json(response)
    }catch(e){
        res.status(500).json({error:'error clearing messages'})
    }
})
router.get('/group/:groupId', async(req,res) => {
    const {groupId} = req.params
    try{
        const messages = await Message.find({type:'group', groupId})
        .sort({timestamp:-1})
        .limit(20)
        res.json(messages)
    }catch(e){
        res.status(500).json({error:'error fetching messages'})
    }
})



module.exports = router;