const Category = require('../../../models/api/v1/category')
const funcHelpers = require('../../../helpers/response')

async function addCategory (req, res){
    try {
        if (req.decoded.role !== 'admin'){
            return res.status(403).json(funcHelpers.errorResponse('Only For Admin'))
        }
        let category = await Category.create(req.body)
        res.status(201).json(funcHelpers.successResponse(category, "Add new category success"))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err, "Wrong type"))
    }
}

async function editCategory(req, res){
    try {
        if (req.decoded.role !== 'admin'){
            return res.status(403).json(funcHelpers.errorResponse('Only For Admin'))
        }
        let category = await Category.findByIdAndUpdate(req.params.id, {$set: req.body})
        res.status(200).json(funcHelpers.successResponse(category, "Edit Category Success"))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err.message))
    }
}
async function deleteCategory(req, res){
    try {
        if (req.decoded.role !== 'admin'){
            return res.status(403).json(funcHelpers.errorResponse('Only For Admin'))
        }
        let category = await Category.findByIdAndDelete(req.params.id)
        res.status(200).json(funcHelpers.successResponse(category, "Delete category Success"))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err))
    }
}

async function showCategory (req, res){
    let category = await Category.find({})
    res.status(200).json(funcHelpers.successResponse(category, "Show Category Success"))
}

module.exports = {addCategory, editCategory, deleteCategory, showCategory}
