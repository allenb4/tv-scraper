const express = require('express');
const router = express.Router();
const tvShowController = require('../controllers/tvShowController');

router.get('/shows', tvShowController.getAllShows);

module.exports = router;
