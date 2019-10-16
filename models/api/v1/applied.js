const mongoose = require('mongoose')

const appliedSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: [true, 'Reason must filled in']
    },
    id_scholarship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scholarship',
        required: [true, 'id scholarship must filled in']
    },
    status: {
        type: String,
        enum: ['applied', 'accept', 'reject'],
        default: 'applied'
    },
    id_investor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investor'
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
})
const Applied = mongoose.model('Applied', appliedSchema)
module.exports = Applied
