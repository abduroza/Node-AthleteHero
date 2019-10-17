var express = require('express');
var router = express.Router();
var usersController = require('../../../controllers/api/v1/usersController.js');
const auth = require('../../../middleware/auth');

router.get('/', auth.isAuthenticated, usersController.getUsers)
    .post('/', usersController.insertUsers);
router.put('/:id', auth.isAuthenticated, usersController.usersUpdate)
    .delete('/:id', auth.isAuthenticated, usersController.usersDelete)
router.delete('/', auth.isAuthenticated, usersController.userDeleteWithAllData)
router.post('/auth', usersController.usersAuth)
router.put('/update_image/:id', auth.isAuthenticated, usersController.updateImage)

router.get('/verify/:token', usersController.usersVerifyEmail);
router.post('/forgot_password', usersController.forgotPassword);
router.post('/reset_password', usersController.resetPassword);
router.post('/resend_email', usersController.resendEmail);

module.exports = router;
