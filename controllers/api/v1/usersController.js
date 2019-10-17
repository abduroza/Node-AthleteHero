var FuncHelpers     = require('../../../helpers/response');
var Users           = require('../../../models/api/v1/users');
var Applied         = require('../../../models/api/v1/applied')
var Achievement     = require('../../../models/api/v1/achievement_athlete')
var Investor        = require('../../../models/api/v1/investor')
var Profile_athlete = require('../../../models/api/v1/profile_athlete')
var Scholarship     = require('../../../models/api/v1/scholarship')
const jwt           = require('jsonwebtoken');
const bcrypt        = require('bcryptjs');
const env           = require('dotenv').config();
const saltRounds    = 10;
const Multer        = require('multer')
var ImageKit        = require('imagekit')

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
            "folder"   : "/users"
        });

        uploadPromise.then((result)=>{
            Users.findByIdAndUpdate(req.params.id, {image:result.url}, (err, updt)=>{
                if(err) return res.status(422).json(FuncHelpers.errorResponse("can't update url image")) 

                Users.findById(updt._id, (err, showUser)=>{
                    if(err) return res.status(422).json(FuncHelpers.errorResponse("can't update url image"))   
                    
                    let data_image = {
                        _id: showUser._id,
                        image: showUser.image
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

exports.getUsers = function(req, res, next){
    Users.findById(req.decoded._id).select('_id role email fullname image')
        .then((users)=>{
            res.status(200).json(FuncHelpers.successResponse(users));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.usersDelete = function(req, res) {
    if (req.decoded.role !== 'admin'){
        return res.status(403).json(FuncHelpers.errorResponse('Only For Admin'))
    }

    Applied.deleteMany({id_user: req.params.id}).exec()
        .then((applied) => {
            Achievement.deleteMany({id_user: req.params.id}).exec().then()
            Profile_athlete.deleteOne({id_user: req.params.id}).exec().then()
            Scholarship.deleteMany({id_user: req.params.id}).exec().then()
            Investor.deleteOne({id_user: req.params.id}).exec().then()
            Users.findByIdAndDelete(req.params.id).exec()
                .then((user)=>{
                    res.status(200).json(FuncHelpers.successResponse(user, "Success delete user"));
                })
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        })
}

exports.userDeleteWithAllData = async function(req, res){
    if (req.decoded.role == 'athlete'){
        try {
            let applied = await Applied.deleteMany({id_user: req.decoded._id})
            let achievement = await Achievement.deleteMany({id_user: req.decoded._id})
            let athlete = await Profile_athlete.deleteOne({id_user: req.decoded._id})
            let user = await Users.findByIdAndDelete(req.decoded._id)

            res.status(200).json(FuncHelpers.successResponse(user, "Delete user success"))
        } catch (err) {
            res.status(422).json(FuncHelpers.errorResponse(err))
        }
    } else if (req.decoded.role == 'investor'){
        try {
            let scholarship = await Scholarship.deleteMany({id_user: req.decoded._id})
            let investor = await Investor.deleteOne({id_user: req.decoded._id})
            let user = await Users.findByIdAndDelete(req.decoded._id)

            res.status(200).json(FuncHelpers.successResponse(user, "Show your applied scholarship"))
        } catch (err) {
            res.status(422).json(FuncHelpers.errorResponse(err))
        }
    } else {
        return res.status(403).json(FuncHelpers.errorResponse('Admin account not allowed to deleted'))
    }
}

exports.forgotPassword = function(req, res, next){
    Users.findOne({ email: req.body.email }, 'email, _id').exec()
        .then((users)=>{

            var token       = FuncHelpers.randToken();
            var exp_token   = new Date(new Date().setHours(new Date().getHours() + 6));

            var email_to        = req.body.email;
            var email_from      = 'aku@todoglint.com';
            var subject         = 'Change password todoglint.com';

            var link            = "http://"+req.get('host')+"/api/v1/users/change_password/"+users._id+"/"+token;
            var html            = 'Plese click link bellow, if you want to reset and change your password<br>';
                html            += '<br><strong><a href='+link+'>'+link+'</a></strong>';
                html            += '<br><br>Thanks';

            FuncHelpers.sendMail(email_to, email_from, subject, html);

            var update_token = {
                token: token,
                exp_token : exp_token
            } 
            Users.findOneAndUpdate({_id: users._id}, update_token)
                .then((users)=>{
                    res.status(200).json(FuncHelpers.successResponse("Success send email for reset password"));
                })
                .catch((err)=>{
                    res.status(422).json(err);
                });
        })
        .catch((err)=>{
            res.status(422).json(err);
        });
}

exports.resetPassword = function(req, res, next){
    let id          = req.body.id;
    let token       = req.body.token;
    let password    = req.body.password;

    Users.findOneAndUpdate({"_id":id, "token":token}, { password: password }).exec()
        .then((users)=>{
            res.status(200).json(FuncHelpers.successResponse(users));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.resendEmail = function(req, res, next){
    var token       = FuncHelpers.randToken();
    var exp_token   = new Date(new Date().setHours(new Date().getHours() + 6));

    Users.findOne({ email: req.body.email }, '_id').exec()
        .then((users)=>{

            var email_to        = req.body.email;
            var email_from      = 'aku@todoglint.com';
            var subject         = 'Verify your main in Todo-glint';

            var link            = "http://"+req.get('host')+"/api/v1/users/verify/"+token;
            var html            = 'Plese click link bellow, if you register at todoglint.com<br>';
                html            += '<br><strong><a href='+link+'>'+link+'</a></strong>';
                html            += '<br><br>Thanks';

            FuncHelpers.sendMail(email_to, email_from, subject, html);
            
            Users.findOneAndUpdate({_id: users._id}, { is_verified: false, exp_token: exp_token, token: token})
                .then((users)=>{
                    res.status(200).json(FuncHelpers.successResponse("Success resend token"));
                })
                .catch((err)=>{
                    res.status(422).json(err);
                });

        })
        .catch((err)=>{
            res.status(422).json(err);
        });
}

exports.insertUsers = function(req, res, next){
    var email_token = FuncHelpers.randToken();
    var hash = bcrypt.hashSync(req.body.password, saltRounds)

    req.body['email_token']             = email_token
    req.body['exp_token']               = new Date(new Date().setHours(new Date().getHours() + 6))
    req.body['password']                = hash
    req.body['image']                   = 'https://i.imgur.com/2497wIB.png'

    Users.create(req.body)
        .then((users) => {
            
            var email_to        = req.body.email;
            var email_from      = 'admin@belegend.com';
            var subject         = 'Verify your mail in BeLegend';

            var link            = "http://"+req.get('host')+"/api/v1/users/verify/"+email_token;
            var html            = 'Plese click link bellow, if you register at BeLegend.com<br>';
                html            += '<br><strong><a href='+link+'>'+link+'</a></strong>';
                html            += '<br><br>Thanks';

            FuncHelpers.sendMail(email_to, email_from, subject, html)

            let jwt_token = jwt.sign(users.toJSON(), process.env.SECRET_KEY, { 
                algorithm: 'HS256',
                expiresIn: '1d'
            })

            let result = {
                _id          : users._id,
                role         : users.role,
                image        : users.image,
                token        : jwt_token
            }

            res.status(201).json(FuncHelpers.successResponse(result))
        })
        .catch((err) => {
            res.status(422).json(FuncHelpers.errorResponse(err))
        })
}

exports.usersVerifyEmail = function(req, res, next){  
    let token = req.params.token;

    Users.findOne({ token: token }, 'exp_token').exec()
        .then((users)=>{
            if(Date.now()<users.exp_token){

                Users.findOneAndUpdate({token: token}, { is_verified: true})
                .then((users)=>{
                    res.status(200).json(FuncHelpers.successResponse("Success verified your users"));
                })
                .catch((err)=>{
                    res.status(422).json(err);
                });
        
            }else{
                res.status(422).json(FuncHelpers.errorResponse('Time token validations is expired, please resend email confirm'))
            }
        })
        .catch((err)=>{
            res.status(422).json(err);
        });
}

exports.usersUpdate = function(req, res, next){  
    let id          = req.params.id;
    var hash        = bcrypt.hashSync(req.body.password, saltRounds)
    req.body['password']    = hash

    Users.findOneAndUpdate({"_id":id}, req.body).exec()
        .then((users)=>{
            res.status(200).json(FuncHelpers.successResponse(users));
        })
        .catch((err)=>{
            res.status(422).json(FuncHelpers.errorResponse(err));
        });
}

exports.usersAuth = (req, res, next) => {
    
    Users.findOne({"email": req.body.email.toLowerCase()})
        .then((users)=>{
            if(users!==null){
                bcrypt.compare(req.body.password, users.password).then(function (result) {
                    if (result) {

                        Users.findOne({"email": req.body.email.toLowerCase()}).select('_id role email fullname image')
                            .then((users)=>{
                                var token = jwt.sign(users.toJSON(), process.env.SECRET_KEY, { 
                                    algorithm: 'HS256',
                                    expiresIn: '1d'
                                });

                                let data_login = {
                                    _id:   users._id,
                                    role:   users.role,
                                    email:   users.email,
                                    fullname:   users.fullname,
                                    image:   users.image,     
                                    token:   token
                                }
                                
                                res.status(200).json(FuncHelpers.successResponse(data_login))
                            })
                            .catch((err)=>{
                                res.status(401).json(FuncHelpers.errorResponse(err));
                            });
                    } else {
                        res.status(401).send(FuncHelpers.errorResponse("Password is wrong"))
                    }
                }).catch((err) => { return next(err) })
            }else{
                res.status(401).send(FuncHelpers.errorResponse("Email not exist"));
            }
        })
        .catch((err)=>{
            res.status(422).send(FuncHelpers.errorResponse("Can't login"));
        });

}






