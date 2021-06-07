const express = require('express');
const database = require('../controllers/data');
const router = express.Router();
const authController = require('../controllers/auth');


router.post('/sortUserData', database.sortUserData);

router.post('/searchUserData', database.searchUserData);

router.post('/adminSortBooks', database.adminSortBooks);

router.post('/adminSearchBooks', database.adminSearchBooks);

router.post('/adminAddBook', database.adminAddBook);

router.post('/adminSaveBook/:bookID', database.adminSaveBook);

router.post('/categorySortBooks/:title', database.categorySortBooks);

router.post('/displaySortBooks', database.displaySortBooks);

router.post('/searchBooks', authController.isLoggedIn, database.searchBooks);

router.post('/searchInLibrary', authController.isLoggedIn, database.searchInLibrary);

router.post('/adminSortSales', database.adminSortSales);

router.post('/adminSearchSales', database.adminSearchSales);

router.get('/dailySales', database.dailySales);

router.get('/monthlySales', database.monthlySales);

router.get('/annualSales', database.annualSales);



module.exports = router;