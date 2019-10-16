const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;
var validate        = require('mongoose-validator')
var uniqueValidator = require('mongoose-unique-validator')

const profileAthleteSchema = new Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    aboutme: {
        type: String
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    birthdate: {
        type: Date, 
        required: true
    },
    birthplace: {
        type: String
    },
    gender: {
        type: String,
        enum : ['Male','Female'],
        required: true
    },
    blood_type: {
        type: String,
        enum : ['A','B','AB','O']
    },
    parent_name: {
        type: String
    },
    parent_phonenumber: {
        type: String
    },
    parent_job: {
        type: String
    },
    education_level: {
        type: String,
        required: true
    },
    name_education: {
        type: String,
        required: true
    },
    link_sosmed: {
        type: String
    },
    link_youtube: {
        type: String
    },
    id_user: [{
        type  : Schema.Types.ObjectId, 
        ref     : 'Users'
    }],
    id_sport_category: [{
        type  : Schema.Types.ObjectId, 
        ref     : 'Category'
    }],
    list_id_ach: [{
        type  : Schema.Types.ObjectId, 
        ref     : 'Achievement'
    }]
}, { collection: 'profile_athlete' });

profileAthleteSchema.plugin(uniqueValidator); 

var Profile_athlete = mongoose.model("Profile_athlete", profileAthleteSchema);
module.exports = Profile_athlete;