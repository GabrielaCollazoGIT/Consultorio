const express = require('express'); 

const patientController = require('../controllers/patient-controller');
const auth = require('../middleweare/check.auth');
const validateRol = require('../middleweare/validate.rol');

const router = express.Router();

router.use(auth);
router.get('/',patientController.getPatients);

router.get('/:id',patientController.getPatientById);
                
router.post('/new', patientController.createPatient);

router.put('/:id', patientController.updatePatient);  
                    
router.delete('/:id',patientController.deletePatient);


module.exports = router;