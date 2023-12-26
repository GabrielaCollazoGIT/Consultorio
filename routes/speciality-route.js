const express = require('express'); 
const specialityController = require('../controllers/speciality-controller');
const auth = require('../middleweare/check.auth');
const validateRol = require('../middleweare/validate.rol');

const router = express.Router();

router.use(auth);
router.get('/',specialityController.getSpecialities);

router.get('/:id',specialityController.getSpecialityById);
                
router.post('/new',validateRol.adminValidate, specialityController.createSpeciality);

router.put('/:id', validateRol.adminValidate,specialityController.updateSpeciality);  
                    
router.delete('/:id',validateRol.adminValidate,specialityController.deleteSpeciality);


module.exports = router;