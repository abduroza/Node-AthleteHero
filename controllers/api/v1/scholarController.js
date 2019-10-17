const Scholarship = require('../../../models/api/v1/scholarship')
const Applied = require('../../../models/api/v1/applied')
const Investor = require('../../../models/api/v1/investor')
const User = require('../../../models/api/v1/users')
const funcHelpers = require('../../../helpers/response')
const multer = require('multer')
const Datauri = require('datauri');
const dUri = new Datauri();
const cloudinary = require('cloudinary').v2;

const fileFormat = (req, file, cb) => {
    if (file.mimetype === 'image/gif' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb ("error: only can upload image (jpeg, png or gif)")
    }
}

var uploadImage = multer({fileFilter: fileFormat, limits: {fileSize: 1048576}})

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
});
async function addScholarship(req, res){
    try {
        if (req.decoded.role != 'investor'){
            return res.status(403).json(funcHelpers.errorResponse('Access denied. Only for investor'))
        }

        let data_investor = await Investor.findOne({ id_user: req.decoded._id})
        if(data_investor===null){
            return res.status(404).json(funcHelpers.errorResponse('Profile investor not exist'))
        }

        await uploadImage.single('image')(req, res, (err)=>{
            if(err) return res.status(400).json(funcHelpers.errorResponse(err))
            User.findById(req.decoded._id, (err, user) =>{
                Scholarship.create(req.body, (err, scholarship) =>{
                    if (err) return res.status(422).json(funcHelpers.errorResponse(err))

                    scholarship.id_investor = user.id_investor
                    scholarship.id_user = user._id
                    scholarship.save()

                    Investor.findOne({id_user: req.decoded._id}, (err, investor)=>{
                        investor.list_id_sch.push(scholarship)
                        investor.save()

                        if (req.file == null){
                            return res.status(201).json(funcHelpers.successResponse(scholarship, "Add scholarship success"))
                        }
                        let file = dUri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer)
                        cloudinary.uploader.upload(file.content, {use_filename: true, folder: "belegend"}, (err, result) =>{
                            if (err) return res.status(400).json(funcHelpers.errorResponse(err))

                            scholarship.image = result.url
                            scholarship.save()

                            res.status(201).json(funcHelpers.successResponse(scholarship, "Add scholarship success"))
                        })
                    })
                })
            })
        })
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err))
    }
}
async function editScholarship(req, res){
    try {
        let scholarship = await Scholarship.findById(req.params.id)
        if (req.decoded.role != 'investor'){
            return res.status(403).json(funcHelpers.errorResponse('Access denied. Only for investor'))
        } else if (req.decoded._id != scholarship.id_user){
            return res.status(403).json(funcHelpers.errorResponse("Access denied. Not your scholarship"))
        }
        await uploadImage.single('image')(req, res, (err)=>{
            if(err) return res.status(400).json(funcHelpers.errorResponse(err))
            Scholarship.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, scholarship) =>{
                if (err) return res.status(400).json(funcHelpers.errorResponse(err))

                Investor.findOne({id_user: req.decoded._id}, (err, investor)=>{
                    investor.list_id_sch.push(scholarship)
                    investor.save()

                    if (req.file == null){
                        return res.status(201).json(funcHelpers.successResponse(scholarship, "Edit scholarship success"))
                    }
                    let file = dUri.format(`${req.file.originalname}-${Date.now()}`, req.file.buffer)
                    cloudinary.uploader.upload(file.content, {use_filename: true, folder: "belegend"}, (err, result) =>{
                        if (err) return res.status(400).json(funcHelpers.errorResponse(err))

                        scholarship.image = result.url
                        scholarship.save()

                        res.status(201).json(funcHelpers.successResponse(scholarship, "Edit scholarship success"))
                    })
                })
            })
        })
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err))
    }
}
async function getScholarship(req, res){
    try {
        let scholarship = await Scholarship.findById(req.params.id)
            .select('_id title quota description image total_fund start_date end_date id_sport_category id_locations id_investor id_user list_id_applied date_create')
            .populate({path: ''})
            .populate({path: 'id_investor', select: ['_id', 'name', 'phone', 'address']})
            .populate({path: 'id_user', select: ['_id','email','fullname','image','role']})
            .populate({path: 'id_sport_category', select: 'category'})
            .populate({path: 'id_locations', select: 'locations'})
            .populate({
                path: 'list_id_applied',
                select: ['_id', 'reason', 'status', 'id_user'],
                populate: {
                    path: 'id_user',
                    select: ['_id', 'email', 'fullname', 'image']
                }
            })
        res.status(200).json(funcHelpers.successResponse(scholarship, "Show scholarship"))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err))
    }
}
async function getAllScholarship(req, res){
    let scholarship = await Scholarship.find({})
        .select('_id title quota description image total_fund start_date end_date id_sport_category id_locations id_investor id_user date_create')
        .populate({path: 'id_investor', select: ['_id', 'name', 'phone', 'address']})
        .populate({path: 'id_user', select: ['_id','email','fullname','image','role']})
        .populate({path: 'id_sport_category', select: ['_id', 'category']})
        .populate({path: 'id_locations', select: 'locations'})
    res.status(200).json(funcHelpers.successResponse(scholarship, "Show All Scholarship"))
}
async function getScholarshipUserInvestor(req, res){
    let scholarship = await Scholarship.find({id_user: req.decoded._id})
        .select('_id title quota description image total_fund start_date end_date id_sport_category id_locations id_investor id_user date_create')
        .populate({path: 'id_sport_category', select: ['_id', 'category']})
        .populate({path: 'id_locations', select: 'locations'})
    res.status(200).json(funcHelpers.successResponse(scholarship, "Show all your scholarship"))
}

async function deleteScholarship(req, res){
    try {
        let scholarship = await Scholarship.findById(req.params.id)
        if (req.decoded.role != 'investor'){
            return res.status(403).json(funcHelpers.errorResponse('Access denied. Only for investor'))
        } else if (req.decoded._id != scholarship.id_user){
            return res.status(403).json(funcHelpers.errorResponse("Access denied. Not your scholarship"))
        }
        let deleteApplied = await Applied.deleteMany({id_scholarship: req.params.id})
        let deleteScholarship = await Scholarship.findByIdAndDelete(req.params.id)
        res.status(200).json(funcHelpers.successResponse(deleteScholarship, 'Delete scholarship success'))
    } catch (err) {
        res.status(422).json(funcHelpers.errorResponse(err))
    }
}

async function getAllScholarshipPaginations(req, res){
    var perPage = 10
        , page = Math.max(0, Number(req.params.page)-1)
        , skip = Number(perPage) * Number(page)
        , showin_start  = Number(skip)+1
    
    var query = {};
    if(req.params.idcategory!=='all') {
        query["id_sport_category"] = req.params.idcategory;
    }
    if(req.params.idlocations!=='all') {
        query["id_locations"] = req.params.idlocations;
    }

    var sort = 'asc';
    if(req.params.time!=='new') {
        sort = 'desc';
    }

    let total_scholarship = await Scholarship.count(query)
        .select('_id')
        .sort({
            date_create: sort
        })

    let scholarship = await Scholarship.find(query)
        .select('_id title quota description image total_fund start_date end_date id_sport_category id_locations id_investor id_user date_create')
        .populate({path: 'id_investor', select: ['_id', 'name', 'phone', 'address']})
        .populate({path: 'id_user', select: ['_id','email','fullname','image','role']})
        .populate({path: 'id_sport_category', select: ['_id', 'category']})
        .populate({path: 'id_locations', select: 'locations'})
        .limit(perPage)
        .skip(skip)
        .sort({
            date_create: sort
        })
    
    var showin_end      = showin_start+perPage>total_scholarship?total_scholarship:showin_start+perPage-1
    var showing         = showin_start>total_scholarship?"0":showin_start+'-'+showin_end
    
    var result = {
        total_result    : total_scholarship,
        showing         : showing,
        list_result     : scholarship
    }
    res.status(200).json(funcHelpers.successResponse(result, "Show All Scholarship"))
}
module.exports = {addScholarship, editScholarship, getScholarship, getAllScholarship, getScholarshipUserInvestor, deleteScholarship, getAllScholarshipPaginations}
