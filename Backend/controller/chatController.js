const Chat = require('../models/Chat');
// const User = require('../models/User');

const chatController = {
    accessChat: async (req,res) => {
        const {userId} = req.body;

        if(!userId) {
            return res.status(400).json({
                message: 'The request did not send the User ID'
            })
        }

        let chat = await Chat.findOne({
            isGroupChat: false,
            users: {$all: [req.user.id, userId]}
        })
        .populate({
            path: "users",
            select: "-password"
        })
        .populate("latestMsg.sender", "userName email profPic");

        if (!chat) {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user.id, userId],
            };
            chat = await Chat.create(chatData);
            chat = await Chat.findById(chat._id).populate({
                path: "users",
                select: "-password"
            });
        }

        res.status(200).json(chat);
        
    },

    //return all chats of a user
    fetchChats: async (req, res) => {
        try {
            const chats = await Chat.find({users: req.user._id})
                .populate({
                    path: "users",
                    select: "-password"
                })
                .populate({
                    path: "groupAdmin",
                    select: "-password"
                })
                .populate("latestMsg")
                .sort({updatedAt: -1})
                .populate({
                    path: "latestMsg.sender",
                    select: "userName profPic email"
                });
    
            res.status(200).send(chats);
        } catch (error) {
            res.status(400).send({error: error.message});
        }
    },

    createGroupChat: async (req, res) => {
        if(!req.body.users && !req.body.groupName){
            return res.status(400).json({message: "please fill in all the field"});
        }

        let users = JSON.parse(req.body.users);
        if(users.length < 2){
            return res.status(400).json({message: "we need at least 2 users to form a group chat"});
        }
        // push the current authenticated user
        users.push(req.user);

        try {
            const groupChat = await Chat.create({
                chatName: req.body.groupName,
                isGroupChat: true,
                users: users,
                groupAdmin: req.user
            })

            const newGroupChatInfo = await Chat.findOne({_id: groupChat._id})
            .populate({
                path: "users",
                select: "-password"
            })
            .populate({
                path: "groupAdmin",
                select: "-password"
            });

            res.status(200).json(newGroupChatInfo)
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    },

    
}

module.exports = chatController;

