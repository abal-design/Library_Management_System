const express = require('express');
const router = express.Router();
const { register, login , verifyOtp, resetPassword , forgotPassword  } = require('../controllers/authcontroller');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);


router.put('/resetPassword', resetPassword);
router.post('/verifyOtp' , verifyOtp)


module.exports = router;
