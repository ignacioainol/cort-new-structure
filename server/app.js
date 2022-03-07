const express = require('express');
const app = express();
const cors = require('cors')
const fileUpload = require('express-fileupload');

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
    res.send("ok route email");
})


// Echamos a correr la api en el puerto 3000 o el que esta definido en las variables de entorno (archivo .env)
app.listen(process.env.PORT || 3000, () => {
    console.log(`api running on port ${process.env.PORT}`);
})
