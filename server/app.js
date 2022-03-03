const express = require('express');
const app = express();
const cors = require('cors')
const fileUpload = require('express-fileupload');
const aws = require('aws-sdk');

const ses = new aws.SES({
    region: 'sa-east-1',
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

//config
app.set('port', 3000 || process.env.PORT);

//aws config to send email
// AWS.config.update({ region: 'sa-east-1' });

//middlewares para funcionamiento necesario
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload({
    createParentPath: true
}));

// Llama al archivo en donde estan todas las rutas de la api
app.use(require('./routes'));

app.post('/email', (req, res) => {
    const { email, message, name } = req.body;
    sesTest('ignacio.ainolrivera@gmail.com', email, message, name).then((val) => {
        console.log('go this back', val);
        res.send("successful");
    }).catch((err) => {
        res.send(err);
    })
});

function sesTest(emailTo, emailFrom, message, name) {
    const params = {
        Destination: {
            ToAddresses: [emailTo]
        },
        Message: {
            Body: {
                Text: {
                    Data: "From contact xxxx" + name + "\n" + message
                }
            },
            Subject: {
                Data: "Name: " + emailFrom
            }
        },
        Source: "iggnaxios@gmail.com"
    };

    return ses.sendEmail(params).promise()
}


// Echamos a correr la api en el puerto 3000 o el que esta definido en las variables de entorno (archivo .env)
app.listen(process.env.PORT || 3000, () => {
    console.log(`api running on port ${process.env.PORT}`);
})
