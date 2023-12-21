const express = require('express'); 
const userController = require('../controllers/user-controller');
const auth = require('../middleweare/check.auth');
const validateRol = require('../middleweare/validate.rol');
const router = express.Router();


router.post('/signup', userController.signUp);

router.post('/login', userController.login);

router.post('/forgot-password', userController.forgotPassword);

router.use(auth);
router.patch('/new-password', userController.recoveryPassword);

router.use(validateRol.adminValidate);
router.get('/', userController.getUsers);






module.exports = router;