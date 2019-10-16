const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const investorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Company name must be filled in']
    },
    phone: {
        type: String,
        required: [true, 'Company phone must be filled in'],
        unique: [true, 'Phone number already exist']
    },
    address: {
        type: String,
        required: [true, 'Company address must be filled in']
    },
    list_id_sch: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scholarship'
    }],
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
})

investorSchema.plugin(uniqueValidator)
const Investor = mongoose.model('Investor', investorSchema)
module.exports = Investor
