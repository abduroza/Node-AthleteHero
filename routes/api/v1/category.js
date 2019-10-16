var router = require('express').Router()
var categoryController = require('../../../controllers/api/v1/categoryController')
var auth = require('../../../middleware/auth')

router.post('/', auth.isAuthenticated, categoryController.addCategory)
router.put('/:id', auth.isAuthenticated, categoryController.editCategory)
router.delete('/:id', auth.isAuthenticated, categoryController.deleteCategory)
router.get('/', categoryController.showCategory)

module.exports = router
