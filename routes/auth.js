const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();


router.post('/userRegisterPage', authController.userRegisterPage); 

router.post('/userLoginPage', authController.userLoginPage); 

router.post('/adminLoginPage', authController.adminLoginPage); 

router.get('/logout', authController.logout);

router.get('/admin/logout', authController.logout);

router.post('/userSendEmail', authController.userSendEmail);

router.get('/userForgotPassword/:userEmail', authController.userForgotPassword);

router.post('/userForgotPassword/:userEmail', authController.userForgotPassword);

router.post('/user/change/:userID', authController.userChangeInfo);

router.post('/user/change-password/:userID', authController.userChangePass);

router.post('/user/icon/:userID', authController.userChangeIcon);

router.post('/admin/change', authController.adminChangeInfo);

router.post('/admin/change-password/', authController.adminChangePass);

router.post('/admin/icon/', authController.adminChangeIcon);

module.exports = router;