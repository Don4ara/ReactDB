const express = require('express');
const { handleSubmit } = require('../controllers/submitController.js');

const router = express.Router();

// POST-запрос для отправки данных
router.post('/submit', handleSubmit);

module.exports = router;
