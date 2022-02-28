require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const aws = require('aws-sdk');

const ses = new aws.SES({
    region: 'sa-east-1',
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

const getToken = (user) => {
    const { user_id, nickname, email, role_id } = user;
    return jwt.sign({
        _id: user_id,
        nickname,
        email,
        role_id
    }, process.env.JWT_SECRET, {
        expiresIn: '48h'
    })
}

// const emailRegistered = async (infoNewUser) => {
//     let transporter = nodemailer.createTransport({
//         host: "email-smtp.sa-east-1.amazonaws.com",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: "AKIATDM4AV7KNJ5QSAEZ", // generated ethereal user
//             pass: "BGBlZzLsthiYRtnp6Z4NceCGiAVHMut+2BHWz55A8faD", // generated ethereal password
//         },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//         from: 'iggnaxios@gmail.com', // sender address
//         to: infoNewUser.email, // list of receivers
//         subject: "Welcome ✔", // Subject line
//         text: `Welcome to Riqra ${infoNewUser.nickname} :D`, // plain text body
//         html: `<b>Welcome to Riqra ${infoNewUser.nickname} :D</b>
//                <p>Ingrese con su email y su password es ${infoNewUser.password}</p>`, // html body
//     });

//     res.status(204).send("Message sent: %s", info.messageId);
// }


const emailRegistered = (infoNewUser) => {
    const { email, message } = infoNewUser;

    sesTest(email, message).then((val) => {
        console.log('go this back', val);
        return "successful";
    }).catch((err) => {
        return err.message;
    })

    return "successful";
}

function sesTest(emailTo, message) {
    const params = {
        Destination: {
            ToAddresses: [emailTo]
        },
        Message: {
            Body: {
                Text: {
                    Data: message
                }
            },
            Subject: {
                Data: "New User :D"
            }
        },
        Source: "iggnaxios@gmail.com"
    };

    return ses.sendEmail(params).promise()
}

module.exports = {
    getToken,
    emailRegistered
}
