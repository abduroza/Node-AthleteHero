var router = require('express').Router()
var locationsController = require('../../../controllers/api/v1/locationsController')
var auth = require('../../../middleware/auth')

router.post('/', auth.isAuthenticated, locationsController.addLocations)
router.put('/:id', auth.isAuthenticated, locationsController.editLocations)
router.delete('/:id', auth.isAuthenticated, locationsController.deleteLocations)
router.get('/', locationsController.showLocations)

module.exports = router
