const User = require('../models/User');
const generateToken = require('../config/tokenGenerator');
const bcrypt = require('bcrypt');

const userController = {
    register: async (req, res) => {
        const {userName, email, password, profPic} = req.body;

        if(!userName || !email || !password){
            res.status(400).json({message: 'please enter all required fields'});
        }

        const existUser = await User.findOne({email});

        if(existUser) res.status(400).json({message: 'User already exists'});

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUser = await new User({
            userName: userName,
            email: email,
            password: hashedpassword,
            profPic: profPic
        });

        const createUser = await newUser.save();
        if(createUser){
            res.status(201).json({
                message: 'Created new user successfully',
                user: createUser,
                token: generateToken(createUser._id)
            });
        }
        else{
            res.status(404).json({message: 'create user failed'})
        }
    },

    login: async (req,res) => {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(404).json({message: 'Password is incorrect'});
        }

        if(user && validPassword){
            res.status(200).json({user: user, token: generateToken(user._id)});
        }
    },

    searchUsers: async (req, res) => {
        const keywords = req.query.search ? {
            $or: [
                {userName: {$regex: req.query.search, $options: "i" }},
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        } : {};

        const users = await User.find(keywords).find({ _id: { $ne: req.user._id } });
        res.send(users);
    }
}

module.exports = userController;