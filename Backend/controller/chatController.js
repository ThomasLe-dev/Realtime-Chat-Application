const Chat = require('../models/Chat');
const User = require('../models/User');

const chatController = {
    accessChat: async (req, res) => {
        const { userId } = req.body;
    
        if (!userId) {
            return res.status(400).json({
                message: 'The request did not send the User ID'
            });
        }
    
        let chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user.id, userId] }
        })
            .populate({
                path: "users",
                select: "-password"
            })
            .populate({
                path: "latestMsg",
                populate: {
                    path: "sender",
                    select: "userName email profPic"
                }
            });
    
        if (!chat) {
            const user = await User.findById(userId); // Fetch user data from userId
            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                });
            }
    
            const chatData = {
                chatName: user.userName, // Use sender's name as chat name
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
                    path: "latestMsg",
                    populate: {
                        path: "sender",
                        select: "userName email profPic"
                    }
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

    renameGroupChat: async(req,res) => {
        const {chatID, newName} = req.body;

        if(!chatID || !newName) {
            return res.status(404).json({message: "The request does not send the chat ID or the new name."});
        }

        try {
            const groupChat = await Chat.findOneAndUpdate(
                {_id: chatID, isGroupChat: true},
                {chatName: newName},
                {new: true}
            )        
            .populate({path: 'users', select: '-password',})
            .populate({path: 'groupAdmin', select: '-password',});

            if(!groupChat){
                return res.status(404).json({message: "Group chat not found"})
            }

            res.status(200).json(groupChat);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    },

    addUsertoGroupChat: async(req,res) => {
        const { chatId, userId } = req.body;

        try {
          const addUser = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { users: userId } },
            { new: true }
          ).populate("users", "-password").populate("groupAdmin", "-password");
      
          if (!addUser) {
            throw new Error("Chat Not Found");
          }
      
          res.status(200).json(addUser);
        } catch (error) {
          res.status(404).json({ error: error.message });
        }
    },

    removeFromGroup: async(req,res) => {
        const {chatId, userId} = req.body;

        try {
            const removeUser = await Chat.findByIdAndUpdate(
                chatId,
                { $pull: {users: userId}},
                {new: true}
            ).populate("users", "-password").populate("groupAdmin", "-password");

            if(!removeUser){
                throw new Error("Chat not found");
            }
            res.status(200).json(removeUser)
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    
}

module.exports = chatController;

