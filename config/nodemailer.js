var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: '220971053567-e085hvvr07ce49l0ojkeq9s8796m45ne.apps.googleusercontent.com',
        clientSecret: 'oFNyg1e6VazkUvfM6ZpQIHss'
    },
    tls:{
        rejectUnauthorized: false
    }
});

module.exports = transporter;