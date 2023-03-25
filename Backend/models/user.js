const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true,
        unique: true
    },

    profPic: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema);