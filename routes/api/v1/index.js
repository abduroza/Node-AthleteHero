var express = require('express')
var router = express.Router()
const usersRouter = require('./users')
const categoryRouter = require('./category')
const locationsRouter = require('./locations')
const investorRouter = require('./investor')
const profileAthleteRouter = require('./profile_athlete')
const scholarshipRouter = require('./scholarship')
const achievementAthleteRouter = require('./achievement_athlete')
const appliedRouter = require('./applied')

router.use('/users', usersRouter)
router.use('/locations', locationsRouter)
router.use('/category', categoryRouter)
router.use('/investor', investorRouter)
router.use('/profile_athlete', profileAthleteRouter)
router.use('/scholarship', scholarshipRouter)
router.use('/achievement', achievementAthleteRouter)
router.use('/applied', appliedRouter)

router.get('/', function (req, res, next) {
  res.render('index', { title: 'API V1' })
});

module.exports = router;
