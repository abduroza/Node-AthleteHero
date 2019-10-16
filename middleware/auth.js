var jwt             = require('jsonwebtoken');
var FuncHelpers     = require('../helpers/response.js');

exports.isAuthenticated = function (req, res, next) {
    //console.log(req.headers.authorization)
    var token = req.headers.authorization;
    //var token = req.headers['x-access-token'] || req.headers['authorization'];
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if(err){
                res.status(401).json(FuncHelpers.errorResponse('Failed for authenticated token'));
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        return res.status(401).send({message: 'No token provided'});
    }
}