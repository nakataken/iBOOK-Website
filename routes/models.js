const express = require('express');
const model = require('../models');
const router = express.Router();

router.get('/BooksTable', model.BooksTable);

module.exports = router;