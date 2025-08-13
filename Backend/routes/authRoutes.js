const express = require('express');
const router = express.Router();

const { register, login , verifyOtp, forgotPassword  } = require('../controllers/authcontroller');
// const {getUsers} = require('../controllers/usercontroller')

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
// router.get("/users", getUsers);

// router.put('/resetPassword', resetPassword);
router.post('/verifyOtp' , verifyOtp)



module.exports = router;
