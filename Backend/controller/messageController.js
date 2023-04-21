const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');


const messageController = {
    sendMessage: async(req,res) =>{
        const {content, chatId} = req.body;

        if(!content || !chatId){
            return res.status(400).json({message: 'Invalid Data'});
        }
        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId
        };
        
        try {
            const message = await Message.create(newMessage);

            await message.populate(
                [
                    {path: "sender", select: "userName profPic"}, 
                    {path: "chat"}
                ]
            );

            // Populate the users field of the chat object associated with the message
            await User.populate(message.chat, {
                path: 'users',
                select: 'userName profPic email'
            });

            await Chat.findByIdAndUpdate(chatId, {latestMsg: message});
            res.status(200).json(message);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    },

    allMessages: async(req,res) => {
        try {
            const messages = await Message.find({chat: req.params.chatId})
            .populate('sender', 'userName email profPic')
            .populate('chat');

            res.status(200).json(messages);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
}

module.exports =  messageController;