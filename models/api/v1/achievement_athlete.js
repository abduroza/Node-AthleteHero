const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;
var validate        = require('mongoose-validator')
var uniqueValidator = require('mongoose-unique-validator')

const achivementAthleteSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    year: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    id_user: [{
        type  : Schema.Types.ObjectId, 
        ref     : 'Users'
    }]
}, { collection: 'achievement_athlete' });

achivementAthleteSchema.plugin(uniqueValidator); 

var Achievement_athlete = mongoose.model("Achievement_athlete", achivementAthleteSchema);
module.exports = Achievement_athlete;