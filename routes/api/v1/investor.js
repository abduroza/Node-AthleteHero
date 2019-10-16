const router = require('express').Router()
const investorController = require('../../../controllers/api/v1/investorController')
const auth = require('../../../middleware/auth')

router.post('/', auth.isAuthenticated, investorController.addProfile)
router.put('/:id', auth.isAuthenticated, investorController.editProfile)
router.get('/', auth.isAuthenticated, investorController.showProfile)
router.delete('/:id', auth.isAuthenticated, investorController.deleteProfile)

module.exports = router
