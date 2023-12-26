const express = require('express'); 

const specialityController = require('../controllers/speciality-controller');
const auth = require('../middleweare/check.auth');
const validateRol = require('../middleweare/validate.rol')
const router = express.Router();

router.use(auth);  
router.get('/',specialityController.getSpecialities);
router.use(validateRol.adminValidate);  
router.get('/:id',specialityController.getSpecialityById);
                
router.post('/new', specialityController.createSpeciality);

router.put('/:id', specialityController.updateSpeciality);  
                    
router.delete('/:id',specialityController.deleteSpeciality);


module.exports = router;