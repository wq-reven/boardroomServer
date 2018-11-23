/**
 * @Description 邮件发送 
 * 调用方法:sendMail('xxxxxxxx@xx.com','这是测试邮件', '这是一封测试邮件');
 */
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('./dbconfig/emailconfig')
smtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
}));

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 * @description 邮件发送方法
 */
module.exports = sendMail = (recipient, subject, html) => {
    smtpTransport.sendMail({
        from: '简单学习网<' + config.email.user + '>',
        to: recipient,
        subject: subject,
        html: '<div style="margin:0;padding:10px">' + html + '</div>'
    }, function (error, response) {
        if (error) {
            console.log(error);
        }
        console.log('发送成功')
    });
}
