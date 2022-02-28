const express = require('express');
const router = express.Router();
const { create, getAllUsers, getEscorts, signin, updatePassword, changeAvatar, testEmail } = require('../controllers/users.controller');

router.get('/', getAllUsers);
router.post('/escorts', create);
router.get('/escorts', getEscorts);
router.post('/signin', signin);
router.post('/changePassword', updatePassword);
router.post('/changeAvatar', changeAvatar);
router.post('/email', testEmail)


module.exports = router;