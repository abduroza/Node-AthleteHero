const mongoose = require('mongoose')

const scholarshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title must be filled in']
    },
    quota: {
        type: Number,
        required: [true, 'Quota must be filled in']
    },
    description: {
        type: String,
        required: [true, 'Description must be filled in']
    },
    image: {
        type: String,
        default: 'No Image'
    },
    total_fund: {
        type: Number,
        required: [true, 'Total fund must be filled in'],
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline submission must be filled in']
    },
    start_date: {
        type: Date,
        required: [true, 'Start date must be filled in']
    },
    end_date: {
        type: Date,
        required: [true, 'End date must be filled in']
    },
    id_sport_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'id sport category must be filled in']
    },
    id_locations: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Locations',
    },
    id_investor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investor'
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    list_id_applied: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applied'
    }],
    date_create: {
        type: Date,
        default: Date.now
    }
})
const Scholarship = mongoose.model('Scholarship', scholarshipSchema)
module.exports = Scholarship
