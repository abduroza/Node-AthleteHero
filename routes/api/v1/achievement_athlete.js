var router = require('express').Router()
var auth = require('../../../middleware/auth')
var achievementAthleteController = require('../../../controllers/api/v1/achievementAthleteController')

router.post('/', auth.isAuthenticated, achievementAthleteController.addAchievementAthlete)
     .get('/', auth.isAuthenticated, achievementAthleteController.getAchievementAthlete)
router.get('/:id_users', achievementAthleteController.getAchievementAthleteByIdUsers)
    .put('/:id', auth.isAuthenticated, achievementAthleteController.editAchievementAthlete)
    .delete('/:id', auth.isAuthenticated, achievementAthleteController.deleteAchievementAthlete) 
router.put('/update_image/:id', auth.isAuthenticated, achievementAthleteController.updateImage)

module.exports = router;