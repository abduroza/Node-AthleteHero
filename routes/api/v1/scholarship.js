const router = require('express').Router()
const scholarController = require('../../../controllers/api/v1/scholarController')
const auth = require('../../../middleware/auth')


router.post('/', auth.isAuthenticated, scholarController.addScholarship)
router.put('/:id', auth.isAuthenticated, scholarController.editScholarship)
router.get('/user', auth.isAuthenticated, scholarController.getScholarshipUserInvestor)
router.get('/pagination/all/:paginations/:time/:idcategory/:idlocations',  )
router.get('/:id', scholarController.getScholarship)
router.get('/', scholarController.getAllScholarship)
router.delete('/:id', auth.isAuthenticated, scholarController.deleteScholarship)

module.exports = router
