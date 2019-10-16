const router = require('express').Router()
const appliedController = require('../../../controllers/api/v1/appliedController')
const auth = require('../../../middleware/auth')

router.post('/', auth.isAuthenticated, appliedController.addApplied)
router.put('/:id', auth.isAuthenticated, appliedController.changeStatus)
router.get('/accept', auth.isAuthenticated, appliedController.showAccept)
router.get('/:id', auth.isAuthenticated, appliedController.showById)
router.get('/', auth.isAuthenticated, appliedController.showAll)
router.get('/accept/:id', appliedController.showAllUserAccept)
router.get('/apply/:id', auth.isAuthenticated, appliedController.showAllUserApply)

module.exports = router
