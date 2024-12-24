const express = require('express')
const router = express.Router()
const Message = require('../models/Message')
const notificationsBLL = require('../BLL/notificationsBLL')

router.get('/:recipientId', async (req,res) =>{
    const {recipientId} = req.params
    const filters = req.query 
    try{
        const count = await  notificationsBLL.getAllPrivateNotifications(recipientId,filters)
        res.json(count)

    }catch (e){
       console.error('Error fetching unread private messages:', error);
       res.status(500).json({ error: 'Failed to fetch unread messages' });
    }
})



router.get('/unread/group', async (req, res) => {
    const { userId } = req.query;
    try {
        const count = await notificationsBLL.getAllGroupsNotifications(userId)
        res.json({ count });
    } catch (error) {
        console.error('Error fetching unread group messages:', error);
        res.status(500).json({ error: 'Failed to fetch unread messages' });
    }
});

router.get('/unread/group/:groupId', async (req, res) => {
    const { userId } = req.query;
    const {groupId } = req.params
    try {
        const count = await notificationsBLL.getNotificationsByGroup(userId, groupId)
        res.json({ count });
    } catch (error) {
        console.error('Error fetching unread group messages:', error);
        res.status(500).json({ error: 'Failed to fetch unread messages' });
    }
});

module.exports = router
