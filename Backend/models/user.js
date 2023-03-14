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

    emial: {
        type: String,
        require: true
    },

    profPic: {
        type: String,
        require: true,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema);