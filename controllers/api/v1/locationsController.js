const Locations = require('../../../models/api/v1/locations')
const funcHelpers = require('../../../helpers/response')

async function addLocations (req, res){
    try {
        if (req.decoded.role !== 'admin'){
            return res.status(403).json(funcHelpers.errorResponse('Only For Admin'))
        }
        let locations = await Locations.create(req.body)
        res.status(201).json(funcHelpers.successResponse(locations, "Add new Locations success"))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err, "Wrong type"))
    }
}

async function editLocations(req, res){
    try {
        if (req.decoded.role !== 'admin'){
            return res.status(403).json(funcHelpers.errorResponse('Only For Admin'))
        }
        let locations = await Locations.findByIdAndUpdate(req.params.id, {$set: req.body})
        res.status(200).json(funcHelpers.successResponse(locations, "Edit Locations Success"))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err.message))
    }
}
async function deleteLocations(req, res){
    try {
        if (req.decoded.role !== 'admin'){
            return res.status(403).json(funcHelpers.errorResponse('Only For Admin'))
        }
        let locations = await Locations.findByIdAndDelete(req.params.id)
        res.status(200).json(funcHelpers.successResponse(locations, "Delete Locations Success"))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err))
    }
}

async function showLocations (req, res){
    let locations = await Locations.find({})
    res.status(200).json(funcHelpers.successResponse(locations, "Show Locations Success"))
}

module.exports = {addLocations, editLocations, deleteLocations, showLocations}
