const { createUser, getAllEscorts, getAll, loginUser, getUserById, changePassword, updateAvatar } = require('../models/User');
const { getToken, emailRegistered } = require('../utils');
const generator = require('generate-password');
// const fileUpload = require('express-fileupload');
const path = require('path')
const fs = require('fs');

const create = async (req, res) => {

    const password = generator.generate({
        length: 10,
        numbers: true
    });

    try {
        req.body.password = password;
        console.log(req.body);
        await createUser(req.body);
        const data = emailRegistered({ nickname: req.body.nickname, emailTo: req.body.email, password: req.body.password });
        res.status(201).send(data);
    } catch (error) {
        res.send(error.message);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const data = await getAll();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
}

const changeAvatar = async (req, res) => {
    try {

        if (!req.files) {
            return res.status(400).send({ message: 'No Uploaded Image' });
        }

        const file = req.files.file;
        const userId = req.body.userId

        file.mv(path.join(__dirname, `../../frontend/build/uploads/${userId}/${file.name}`), err => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        });


        const userUpdatedAvatar = await updateAvatar(userId, file.name);

        if (userUpdatedAvatar) {
            const { user_id, nickname, role_id, first_login, avatar } = userUpdatedAvatar;
            res.status(200).send({
                user_id,
                nickname,
                role_id,
                first_login,
                avatar,
                token: getToken(userUpdatedAvatar)
            });
        }


    } catch (error) {
        res.status(error.message);
    }

}

const getEscorts = async (req, res) => {
    try {
        const data = await getAllEscorts();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const signinUser = await loginUser(email, password);

        if (signinUser) {
            const { user_id, nickname, role_id, first_login, avatar } = signinUser;
            res.send({
                user_id,
                nickname,
                role_id,
                first_login,
                avatar,
                token: getToken(signinUser)
            });
        } else {
            res.status(401).send({ message: 'Email o Password Incorrecto.' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updatePassword = async (req, res) => {
    const { user_id, password, newPassword, confirmNewPassword } = req.body;

    if (password === '' || newPassword === '' || confirmNewPassword === '') {
        res.status(400).send({ message: "Todos los campos son requeridos." });
    } else {
        try {
            const user = await getUserById(user_id);
            if (user.password === password) {
                if (newPassword === confirmNewPassword) {
                    const updatedPassword = await changePassword(user_id, newPassword);
                    res.status(200).send(updatedPassword);
                } else {
                    res.status(400).send({ message: "La nueva contrase??a no coinciden con la verificaci??n." });
                }
            } else {
                res.status(401).send({ message: "La contrase??a no coincide con su contrase??a actual" });
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    }

}

const testEmail = (req, res) => {
    const password = generator.generate({
        length: 10,
        numbers: true
    });

    req.body.password = password;
    const data = emailRegistered({ nickname: req.body.nickname, emailTo: req.body.emailTo, password: req.body.password })
    res.send(data);
}

module.exports = {
    create,
    getAllUsers,
    getEscorts,
    signin,
    updatePassword,
    changeAvatar,
    testEmail
}