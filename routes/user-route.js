const express = require('express'); 
const userController = require('../controllers/user-controller');
const auth = require('../middleweare/check.auth');
const validateRol = require('../middleweare/validate.rol');
const router = express.Router();


router.post('/signup', userController.signUp);

router.post('/login', userController.login);

router.use(auth);

router.use(validateRol);

router.get('/', userController.getUsers);

router.post('/logout',userController.logout);

module.exports = router;