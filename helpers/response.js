const env           = require('dotenv').config();
const sgMail        = require('@sendgrid/mail');

exports.successResponse = function(results, msg){
    return {
        success: true,
        msg: msg,
        results: results
    }
};

exports.errorResponse = function(err){
    return {
        success: false,
        results: err
    }
};

exports.randToken = function(){
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var token = '';
    for (var i = 16; i > 0; --i) {
        token += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return token;
};

exports.sendMail = function(email_to, email_from, subject, html){
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email_to,
        from: email_from,
        subject: subject,
        html: html,
    };
    return sgMail.send(msg);   
};