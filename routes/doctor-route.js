const express = require('express'); 
const doctorController = require('../controllers/doctor-controller');
const auth = require('../middleweare/check.auth');
const validateRol = require('../middleweare/validate.rol');

const router = express.Router();
router.use(auth);
router.get('/',doctorController.getDoctors);
router.get('/available/:id',doctorController.getDoctorByIdAndTurnsAvailables);


router.use(validateRol.adminValidate);

router.get('/:id',doctorController.getDoctorById);
router.post('/new', doctorController.createDoctor);
router.patch('/:id', doctorController.updateDoctor);  
                    


module.exports = router;

