const mongoose = require ('mongoose')

const categorySchema = new mongoose.Schema({
    category : {
        type: String,
        required: [true, "category must be filled in"]
    }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
