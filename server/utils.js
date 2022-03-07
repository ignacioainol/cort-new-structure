require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const aws = require('aws-sdk');

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
//         from: '"Noreply 👻" <bot@register.com>', // sender address
//         to: infoNewUser.email, // list of receivers
//         subject: "Welcome ✔", // Subject line
//         text: `Welcome to Riqra ${infoNewUser.nickname} :D`, // plain text body
//         html: `<b>Welcome to Riqra ${infoNewUser.nickname} :D</b>
//                <p>Ingrese con su email y su password es ${infoNewUser.password}</p>`, // html body
//     });

//     console.log("Message sent: %s", info.messageId);
// }

const sendEmail = async (infoNewUser) => {
    try {
        aws.config.update({
            secretAccessKey: process.env.AWS_ACCESS_KEY,
            accessKeyId: process.env.AWS_ACCESS_ID,
            region: 'ap-south-1'
        });
        var ses = new aws.SES({ apiVersion: '2017-12-01' });

        const from = 'iggnaxios@gmail.com';
        ses.sendEmail({
            Source: from,
            Destination: { ToAddresses: [infoNewUser.email] }, //CcAddresses: to_cc,
            Message: {
                Subject: {
                    Charset: "UTF-8",
                    Data: email_subject
                },
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: email_message
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: ''
                    }
                }
            }
        }
            , function (err, data) {
                if (err) {
                    console.log(err);
                }
                if (data) {
                    console.log(data);
                    return data;
                }
            });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getToken,
    sendEmail
}
