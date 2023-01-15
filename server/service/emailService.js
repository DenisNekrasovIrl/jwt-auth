const nodemailer = require('nodemailer');
const config = require('../config');
const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: true,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
    }
})

const mailer = async function (email, activationLink, refreshLink = null){
    const text = refreshLink 
    ? 
    `Привет! Для восстановления аккаунта используйте код - ${refreshLink.split('/')[refreshLink.split('/').length - 1]}` 
    :
    `Привет! Для активации аккаунта перейдите по ссылке ниже`;
    const options = {
        from: config.SMTP_USER,
        to: email,
        subject: 'Email_Service',
        text: 'Email_Service',
        html: `
            <h1>${text}</h1>
            <h1><a href = "${activationLink}">Перейдите по ссылке</a></h1>
        `
    }
    await transporter.sendMail(options);
}

module.exports = mailer;