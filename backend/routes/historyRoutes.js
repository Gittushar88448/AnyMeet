const {addToHistory, getUserHistroy} = require('../controllers/HistoryController');
const express = require('express')
const router = express.Router();

router.post('/add-history', addToHistory);
router.get('/get-history', getUserHistroy);

module.exports = router;