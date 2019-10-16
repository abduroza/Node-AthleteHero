const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;
var validate        = require('mongoose-validator')
var uniqueValidator = require('mongoose-unique-validator');

const usersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String, 
        trim: true
    },
    image: {
        type: String
    },
    role: {
        type: String,
        enum : ['athlete','investor','admin'],
        default: 'athlete'
    },
    id_profile_athlete: [{
        type  : Schema.Types.ObjectId, 
        ref     : 'Profile_athlete'
    }],
    id_investor: [{
        type  : Schema.Types.ObjectId, 
        ref     : 'Investor'
    }],
    id_achievement_athlete: [{
        type  : Schema.Types.ObjectId, 
        ref     : 'Achievement_athlete'
    }],
    exp_token: { 
      type: Date
    },
    email_token: {
        type: String
    },
    is_verified: {
        type: Boolean,
        default: false,
        required: true
    },
    date_input: { 
        type: Date, 
        default: Date.now 
      }
}, { collection: 'users' });

usersSchema.plugin(uniqueValidator); 

var Users = mongoose.model("Users", usersSchema);
module.exports = Users;