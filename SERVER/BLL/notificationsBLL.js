const Message = require ('../models/Message')
const mongoose = require('mongoose');

const getAllPrivateNotifications = async (userId,filters)=>{
   const {senderId} = filters
   
    try{ 
        const query = {
            recipientId: userId,
            type: 'user',
            isread:false,
        };
        if (senderId) {
            query.senderId = senderId;
        }
        const count = await Message.countDocuments(query)
        return(count)

    }catch (e){
       console.error('Error fetching unread private messages:', error);
      return ({ error: 'Failed to fetch unread messages' });
    }
}


    const getAllGroupsNotifications = async (userId)=>{

        try {
           
            const count = await Message.countDocuments({
                type: 'group',
                recipientId: userId, // Или фильтрация по группам, если требуется
                isRead: false,
            });
            res.json({ count });
        } catch (error) {
            console.error('Error fetching unread group messages:', error);
            res.status(500).json({ error: 'Failed to fetch unread messages' });
        }

    }

    const getNotificationsByGroup = async(userId, groupId)=>{
        try {
            const count = await Message.countDocuments({
                type: 'group',
                groupId,
                recipientId: userId, 
                isRead: false,
            });
            res.json({ count });
        } catch (error) {
            console.error('Error fetching unread group messages:', error);
            res.status(500).json({ error: 'Failed to fetch unread messages' });
        }
    }
   

module.exports = {getAllPrivateNotifications, getAllGroupsNotifications,getNotificationsByGroup}