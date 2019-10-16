const Applied = require('../../../models/api/v1/applied')
const Investor = require('../../../models/api/v1/investor')
const Scholarship = require('../../../models/api/v1/scholarship')
const funcHelpers = require('../../../helpers/response')

async function addApplied(req, res){
    try {
        let scholarship = await Scholarship.findById(req.body.id_scholarship).populate({path: 'list_id_applied id_user'})
        if(req.decoded.role != 'athlete'){
            return res.status(403).json(funcHelpers.errorResponse("Access denied. Only for athlete"))
        }
        let dataApplied = await Applied.find({ $and:[ {id_user: req.decoded._id}, {id_scholarship: req.body.id_scholarship}]})
        if(dataApplied.length > 0){
            return res.status(403).json(funcHelpers.errorResponse("You already applied this scholarship"))
        }

        let applied = await Applied.create({
            ...req.body,
            id_investor: scholarship.id_investor,
            id_user: req.decoded._id
        })

        scholarship.list_id_applied.push(applied)
        scholarship.save()

        let showApplied = await Applied.findById(applied._id)
            .select('reason status id_user')
            .populate({
                path: 'id_user',
                select:['fullname', 'email', 'image'],
                populate: {
                    path: 'id_profile_athlete id_achievement_athlete',
                    select: ['_id', 'phone', 'address', 'aboutme', 'weight', 'height', 'birthdate', 'birthplace', 'gender', 'blood_type', 'parent_name', 'parent_phonenumber', 'parent_job', 'education_level', 'name_education', 'link_sosmed', 'link_youtube', 'id_sport_category', 'title', 'year', 'image']
                }
            })
            
        let email_to        = scholarship.id_user.email;
        let email_from      = 'belegend@belegend.com';
        let subject         = 'Apply ' + scholarship.title

        let link            = "http://"+req.get('host')+"/api/v1/applied/"+applied._id;
        let html            = '<br>Reason to apply: '+showApplied.reason
            html            += '<br>Email: '+showApplied.id_user.email
            html            += '<br>Fullname: '+showApplied.id_user.fullname
            html            += '<br>Image: '+showApplied.id_user.image
            html            += '<br><br>For detail information click link below';
            html            += '<br><strong><a href='+link+'>'+link+'</a></strong>';
            html            += '<br><br>Thanks,';
            html            += '<br>Admin';

        funcHelpers.sendMail(email_to, email_from, subject, html);

        res.status(201).json(funcHelpers.successResponse(applied, "Applied scholarship success"))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err))
    }
}

async function showById(req, res){
    if (req.decoded.role == 'athlete'){
        try {
            let applied = await Applied.findById(req.params.id)
                .select('_id reason status id_scholarship id_user')
                .populate({
                    path: 'id_scholarship',
                    select: ['_id', 'title', 'quota', 'description', 'image', 'total_fund', 'deadline','start_date', 'end_date', 'id_sport_category', 'id_locations', 'id_investor'],
                    populate: {
                        path: 'id_investor id_locations',
                        select: ['_id', 'name', 'phone', 'address', 'id_user', 'locations'],
                        populate: {
                            path: 'id_user',
                            select: ['_id', 'image']
                        }
                    }
                })
            if (req.decoded._id != applied.id_user){
                return res.status(403).json(funcHelpers.errorResponse("Access denied. Not your applied"))
            }
            res.status(200).json(funcHelpers.successResponse(applied, "Show your applied scholarship"))
        } catch (err) {
            res.status(422).json(funcHelpers.errorResponse(err))
        }
    } else if (req.decoded.role == 'investor'){
        try {
            let investor = await Investor.findOne({id_user: req.decoded._id})
            let applied = await Applied.findById(req.params.id)
                .select('_id reason status id_scholarship id_user id_investor')
                .populate({
                    path: 'id_user',
                    select:['_id', 'fullname', 'email', 'image'],
                    populate: {
                        path: 'id_profile_athlete id_achievement_athlete',
                        select: ['_id', 'phone', 'address', 'aboutme', 'weight', 'height', 'birthdate', 'birthplace', 'gender', 'blood_type', 'parent_name', 'parent_phonenumber', 'parent_job', 'education_level', 'name_education', 'link_sosmed', 'link_youtube', 'id_sport_category', 'title', 'year', 'image']
                    }
                })
            if (JSON.stringify(applied.id_investor) !== JSON.stringify(investor._id)){
                return res.status(403).json(funcHelpers.errorResponse("Access denied. Not your applied"))
            }
            res.status(200).json(funcHelpers.successResponse(applied, "Show your applied scholarship"))
        } catch (err) {
            res.status(422).json(funcHelpers.errorResponse(err))
        }
    } else {
        try {
            let applied = await Applied.findById(req.params.id)
                .select('_id reason status id_scholarship')
                .populate({
                    path: 'id_user id_scholarship', 
                    select:['_id', 'fullname', 'email', 'image', 'title', 'quota', 'description', 'total_fund', 'deadline', 'start_date', 'end_date', 'id_sport_category', 'id_locations' ],
                    populate: {
                        path: 'id_profile_athlete id_achievement_athlete id_investor id_locations',
                        select: ['_id', 'phone', 'address', 'aboutme', 'weight', 'height', 'birthdate', 'birthplace', 'gender', 'blood_type', 'parent_name', 'parent_phonenumber', 'parent_job', 'education_level', 'name_education', 'link_sosmed', 'link_youtube', 'id_sport_category', 'title', 'year', 'image', 'name', 'phone', 'locations']
                    }
                })
            res.status(200).json(funcHelpers.successResponse(applied, "Show applied scholarship"))
        } catch (err) {
            res.status(422).json(funcHelpers.errorResponse(err))
        }
    }
}

async function showAll(req, res){
    if (req.decoded.role == 'athlete'){
        let applied = await Applied.find({id_user: req.decoded._id})
            .select('_id reason status id_scholarship')
            .populate({
                path: 'id_scholarship',
                select: ['_id', 'title', 'quota', 'description', 'image', 'total_fund', 'deadline', 'start_date', 'end_date', 'id_sport_category', 'id_locations', 'id_investor', 'date_create'],
                populate: {
                    path: 'id_investor id_locations',
                    select: ['_id', 'name', 'phone', 'address', 'id_user', 'locations'],
                    populate: {
                        path: 'id_user',
                        select: ['_id', 'image']
                    }
                }
            })
        res.status(200).json(funcHelpers.successResponse(applied, "Show your all applied scholarship"))
    } else if (req.decoded.role == 'investor'){
        let investor = await Investor.findOne({id_user: req.decoded._id})
        let applied = await Applied.find({id_investor: investor._id})
            .select('_id reason status id_scholarship id_user')
            .populate({
                path: ' id_scholarship id_user', 
                select:['title', '_id', 'fullname', 'email', 'image'],
                populate: {
                    path: 'id_profile_athlete id_achievement_athlete',
                    select: ['_id', 'phone', 'address', 'aboutme', 'weight', 'height', 'birthdate', 'birthplace', 'gender', 'blood_type', 'parent_name', 'parent_phonenumber', 'parent_job', 'education_level', 'name_education', 'link_sosmed', 'link_youtube', 'id_sport_category', 'title', 'year', 'image']
                }
            })
        res.status(200).json(funcHelpers.successResponse(applied, "Show your applied scholarship"))
    } else {
        let applied = await Applied.find({})
            .select('_id reason status id_scholarship')
            .populate({
                path: 'id_user id_scholarship', 
                select:['_id', 'fullname', 'email', 'image', 'title', 'quota', 'description', 'total_fund', 'deadline', 'start_date', 'end_date', 'id_sport_category', 'locations', 'date_create'],
                populate: {
                    path: 'id_profile_athlete id_achievement_athlete id_investor',
                    select: ['_id', 'phone', 'address', 'aboutme', 'weight', 'height', 'birthdate', 'birthplace', 'gender', 'blood_type', 'parent_name', 'parent_phonenumber', 'parent_job', 'education_level', 'name_education', 'link_sosmed', 'link_youtube', 'id_sport_category', 'title', 'year', 'image', 'name', 'phone']
                }
            })
        res.status(200).json(funcHelpers.successResponse(applied, "Show applied scholarship"))
    }
}
async function showAccept(req, res){
    if (req.decoded.role == 'athlete'){
        let applied = await Applied.find({id_user: req.decoded._id, status: 'accept'})
            .select('_id reason status id_scholarship')
            .populate({
                path: 'id_scholarship',
                select: ['_id', 'title', 'quota', 'description', 'image', 'total_fund', 'deadline', 'start_date', 'end_date', 'id_sport_category', 'locations', 'id_investor', 'date_create'],
                populate: {
                    path: 'id_investor',
                    select: ['_id', 'name', 'phone', 'address', 'id_user'],
                    populate: {
                        path: 'id_user',
                        select: ['_id', 'image']
                    }
                }
            })
        res.status(200).json(funcHelpers.successResponse(applied, "Show your accept applied scholarship"))
    } else if (req.decoded.role == 'investor'){
        let investor = await Investor.findOne({id_user: req.decoded._id})
        let applied = await Applied.find({id_investor: investor._id, status: 'accept'})
            .select('_id reason status id_scholarship id_user')
            .populate({
                path: 'id_user id_scholarship', 
                select:['_id', 'fullname', 'email', 'image', 'title'],
                populate: {
                    path: 'id_profile_athlete id_achievement_athlete',
                    select: ['_id', 'phone', 'address', 'aboutme', 'weight', 'height', 'birthdate', 'birthplace', 'gender', 'blood_type', 'parent_name', 'parent_phonenumber', 'parent_job', 'education_level', 'name_education', 'link_sosmed', 'link_youtube', 'id_sport_category', 'title', 'year', 'image']
                }
            })
        res.status(200).json(funcHelpers.successResponse(applied, "Show your accept applied scholarship"))
    } else {
        let applied = await Applied.find({status: 'accept'})
            .select('_id reason status id_scholarship')
            .populate({
                path: 'id_user id_scholarship', 
                select:['_id', 'fullname', 'email', 'image', 'title', 'quota', 'description', 'total_fund', 'deadline', 'start_date', 'end_date', 'id_sport_category', 'locations', 'date_create'],
                populate: {
                    path: 'id_profile_athlete id_achievement_athlete id_investor',
                    select: ['_id', 'phone', 'address', 'aboutme', 'weight', 'height', 'birthdate', 'birthplace', 'gender', 'blood_type', 'parent_name', 'parent_phonenumber', 'parent_job', 'education_level', 'name_education', 'link_sosmed', 'link_youtube', 'id_sport_category', 'title', 'year', 'image', 'name', 'phone']
                }
            })
        res.status(200).json(funcHelpers.successResponse(applied, "Show all accept applied scholarship"))
    }
}
async function showAllUserAccept(req, res){
        let applied = await Applied.find({id_scholarship: req.params.id, status: 'accept'})
            .select('_id reason status id_scholarship id_user')
            .populate({
                path: 'id_user id_scholarship', 
                select: ['title', '_id', 'fullname', 'email', 'image']
            })
        res.status(200).json(funcHelpers.successResponse(applied, "Show your accept applied scholarship"))
}
async function showAllUserApply(req, res){
    try {
        let scholarship = await Scholarship.findById(req.params.id)
        if (req.decoded.role != 'investor'){
            return res.status(403).json(funcHelpers.errorResponse('Access denied. Only for investor'))
        } else if (req.decoded._id != scholarship.id_user){
            return res.status(403).json(funcHelpers.errorResponse("Access denied. Not your scholarship"))
        }
        let applied = await Applied.find({id_scholarship: req.params.id, status: 'applied'})
            .select('_id reason status id_scholarship id_user')
            .populate({
                path: 'id_user id_scholarship',
                select: ['_id', 'fullname', 'email', 'image', 'title', 'quota', 'image', 'total_fund', 'deadline', 'start_date', 'end_date', 'locations', 'date_create']
            })
        res.status(200).json(funcHelpers.successResponse(applied, "Show your apply scholarship"))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err))
    }
}
async function changeStatus(req, res){
    try {
        let applied = await Applied.findById(req.params.id)
        let investor = await Investor.findOne({id_user: req.decoded._id})
        if (req.decoded.role !== 'investor'){
            return res.status(403).json(funcHelpers.errorResponse('Only for investor'))
        } else if (`${applied.id_investor}` !== `${investor._id}`){
            return res.status(403).json(funcHelpers.errorResponse("Access denied, not your scholarship"))
        }
        let data = await Applied.findByIdAndUpdate({_id: req.params.id}, {$set: req.body})

        req.body['_id'] = data._id
        res.status(200).json(funcHelpers.successResponse(req.body, "Change status success"))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err))
    }
}

module.exports = {addApplied, showById, showAll, showAccept, changeStatus, showAllUserAccept, showAllUserApply}
