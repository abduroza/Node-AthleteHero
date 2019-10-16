const ProfileAthlete = require('../../../models/api/v1/profile_athlete')
const Users = require('../../../models/api/v1/users')
const FuncHelpers = require('../../../helpers/response')

exports.getProfileAthlete = function(req, res, next){
    if (req.decoded.role !== 'athlete'){
        return res.status(403).json(FuncHelpers.errorResponse('Only For Athlete'))
    }

    ProfileAthlete.find({ id_user: req.decoded._id }).populate({path: 'id_user', select: ['_id','email','fullname','image','role']}).populate('id_sport_category')
        .then((profile_athlete)=>{
            profile_athlete = profile_athlete[0]

            profile_athlete = {
                _id                     : profile_athlete._id,
                phone                   : profile_athlete.phone,
                address                 : profile_athlete.address,
                aboutme                 : profile_athlete.aboutme,
                weight                  : profile_athlete.weight,
                height                  : profile_athlete.height,
                birthdate               : profile_athlete.birthdate,
                birthplace              : profile_athlete.birthplace,
                gender                  : profile_athlete.gender,
                blood_type              : profile_athlete.blood_type,
                parent_phonenumber      : profile_athlete.parent_phonenumber,
                parent_job              : profile_athlete.parent_job,
                education_level         : profile_athlete.education_level,
                name_education          : profile_athlete.name_education,
                link_sosmed             : profile_athlete.link_sosmed,
                link_youtube            : profile_athlete.link_youtube,
                parent_name             : profile_athlete.parent_name,
                id_user                 : profile_athlete.id_user[0],
                id_sport_category       : profile_athlete.id_sport_category[0]
            }
            res.status(200).json(FuncHelpers.successResponse(profile_athlete));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.getProfileAthleteById = function(req, res, next){
    ProfileAthlete.find({ id_user: req.params.id }).populate({path: 'id_user', select: ['_id','email','fullname','image','role']}).populate('id_sport_category')
        .then((profile_athlete)=>{
            profile_athlete = profile_athlete[0]

            profile_athlete = {
                _id                     : profile_athlete._id,
                phone                   : profile_athlete.phone,
                address                 : profile_athlete.address,
                aboutme                 : profile_athlete.aboutme,
                weight                  : profile_athlete.weight,
                height                  : profile_athlete.height,
                birthdate               : profile_athlete.birthdate,
                birthplace              : profile_athlete.birthplace,
                gender                  : profile_athlete.gender,
                blood_type              : profile_athlete.blood_type,
                parent_phonenumber      : profile_athlete.parent_phonenumber,
                parent_job              : profile_athlete.parent_job,
                education_level         : profile_athlete.education_level,
                name_education          : profile_athlete.name_education,
                link_sosmed             : profile_athlete.link_sosmed,
                link_youtube            : profile_athlete.link_youtube,
                parent_name             : profile_athlete.parent_name,
                id_user                 : profile_athlete.id_user[0],
                id_sport_category       : profile_athlete.id_sport_category[0]
            }
            res.status(200).json(FuncHelpers.successResponse(profile_athlete));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.getListAllAthlete = function(req, res, next){
    ProfileAthlete.find({})
        .populate({path: 'id_user', select: ['_id','email','fullname','image','role']})
        .populate('id_sport_category')
        .then((list_profile_athlete)=>{
            res.status(200).json(FuncHelpers.successResponse(list_profile_athlete));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.deleteProfileAthlete = async (req, res)=> {
    try {
        if (req.decoded.role !== 'admin'){
            return res.status(403).json(FuncHelpers.errorResponse('Only For Admin'))
        }
    
        let id          = req.params.id; 
        let profile_athlete = await ProfileAthlete.findByIdAndRemove(id)

        let User = await Users.findById(profile_athlete.id_user)
        User.id_profile_athlete.remove(profile_athlete)
        User.save()

        res.status(200).json(FuncHelpers.successResponse("Success Deleted"));
    } catch (err) {
        res.status(422).json(FuncHelpers.errorResponse(err));
    }
}

exports.addProfileAthlete = async (req, res)=>{
    try {
        if (req.decoded.role !== 'athlete'){
            return res.status(403).json(FuncHelpers.errorResponse('Only For Athlete'))
        }

        let check_profile_investor = await ProfileAthlete.findOne({id_user: req.decoded._id}).select('id_user')
        if(check_profile_investor!==null){
            return res.status(403).json(FuncHelpers.errorResponse('Profile is exist, using edit for edit profile athlete'))
        }

        req.body['id_user'] = await req.decoded._id
        let profile_athlete = await ProfileAthlete.create(req.body)

        let User = await Users.findById(req.decoded._id)
        User.id_profile_athlete.push(profile_athlete)
        User.save()

        res.status(201).json(FuncHelpers.successResponse(profile_athlete, "Add new profile athlete success"))
    } catch (err) {
        res.status(422).json(FuncHelpers.errorResponse(err, "Wrong type"))
    }
}

exports.editProfileAthlete = function(req, res, next){  
    if (req.decoded.role !== 'athlete'){
        return res.status(403).json(FuncHelpers.errorResponse('Only For Athlete'))
    }
    req.body['id_user'] = req.decoded._id

    ProfileAthlete.findOneAndUpdate({"_id":req.params.id}, req.body)
        .then((profile_athlete)=>{
            res.status(200).json(FuncHelpers.successResponse(req.body));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}