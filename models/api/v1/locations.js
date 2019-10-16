const mongoose = require ('mongoose')

const locationsSchema = new mongoose.Schema({
    locations : {
        type: String,
        required: [true, "locations must be filled in"]
    }
})

const Locations = mongoose.model('Locations', locationsSchema)

module.exports = Locations
