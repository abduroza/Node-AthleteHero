const ProfileAthlete = require('../../../models/api/v1/profile_athlete')
const AchievementAthlete = require('../../../models/api/v1/achievement_athlete')
const Users = require('../../../models/api/v1/users')
const FuncHelpers = require('../../../helpers/response')
const Multer        = require('multer')
var ImageKit        = require('imagekit')

exports.getAchievementAthlete = function(req, res, next){

    AchievementAthlete.find({ id_user: req.decoded._id }).populate('id_user')
        .then((achievement_athlete)=>{
            res.status(200).json(FuncHelpers.successResponse(achievement_athlete));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.getAchievementAthleteByIdUsers = function(req, res, next){

    AchievementAthlete.find({ id_user: req.params.id_users }).populate('id_user')
        .then((achievement_athlete)=>{
            res.status(200).json(FuncHelpers.successResponse(achievement_athlete));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.addAchievementAthlete = async (req, res)=>{
    try {
        if (req.decoded.role !== 'athlete'){
            return res.status(403).json(FuncHelpers.errorResponse('Only For Athlete'))
        }

        req.body['id_user'] = await req.decoded._id
        let achiement_athlete = await AchievementAthlete.create(req.body)

        let User = await Users.findById(req.decoded._id)
        User.id_achievement_athlete.push(achiement_athlete)
        User.save()

        res.status(201).json(FuncHelpers.successResponse(achiement_athlete, "Add new achievement athlete success"))
    } catch (err) {
        res.status(422).json(FuncHelpers.errorResponse(err, "Wrong type"))
    }
}

exports.editAchievementAthlete = function(req, res, next){  
    if (req.decoded.role !== 'athlete'){
        return res.status(403).json(FuncHelpers.errorResponse('Only For Athlete'))
    }

    req.body['id_user'] = req.decoded._id

    AchievementAthlete.findOneAndUpdate({"_id":req.params.id}, req.body)
        .then((profile_athlete)=>{
            res.status(200).json(FuncHelpers.successResponse(req.body));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.deleteAchievementAthlete = async (req, res)=> {
    try {
        if (req.decoded.role !== 'admin' && req.decoded.role !== 'athlete'){
            return res.status(403).json(FuncHelpers.errorResponse('Only For Admin or Athlete'))
        }
    
        let id          = req.params.id; 
        let achiement_athlete = await AchievementAthlete.findByIdAndRemove(id)

        let User = await Users.findById(achiement_athlete.id_user)
        User.id_achievement_athlete.remove(achiement_athlete)
        User.save()

        res.status(200).json(FuncHelpers.successResponse("Success Deleted"));
    } catch (err) {
        res.status(422).json(FuncHelpers.errorResponse(err));
    }
}

const storage = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        else if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        else if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, file.fieldname + '-' + Date.now()+'.'+filetype)
    }
})

var upload = Multer().single('image')

var imagekit = new ImageKit({
    "imagekitId" : process.env.IMAGEKIT_ID,       
    "apiKey"     : process.env.IMAGEKIT_PUBLIC_KEY,       
    "apiSecret"  : process.env.IMAGEKIT_SECRET_KEY, 
});

exports.updateImage = function(req, res){
    upload(req, res, function(err){
        var file = req.file
        if (!file) {
            return res.status(422).json(FuncHelpers.errorResponse("please upload file"))
        }

        var uploadPromise;
        uploadPromise = imagekit.upload(req.file.buffer.toString('base64'), {
            "filename" : req.file.originalname,
            "folder"   : "/achievement"
        });
    
        //handle upload success and failure
        uploadPromise.then((result)=>{
            AchievementAthlete.findByIdAndUpdate(req.params.id, {image:result.url}, (err, updt)=>{
                if(err) return res.status(422).json(FuncHelpers.errorResponse("can't update url image")) 

                AchievementAthlete.findById(updt._id, (err, showAchievement)=>{
                    if(err) return res.status(422).json(FuncHelpers.errorResponse("can't update url image"))   
                    
                    let data_image = {
                        _id: showAchievement._id,
                        title: showAchievement.title,
                        image: showAchievement.image
                    }
                    res.status(200).json(FuncHelpers.successResponse(data_image, "URL image has been update"))
                })
            })     
        })
        .catch (err=>{
            res.status(400).json(error("can't upload file"))
        })
    })
}