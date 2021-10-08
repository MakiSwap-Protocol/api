const express = require('express');
const router = express.Router();
const { farmingController } = require('../controllers');

router.route('/pools')
	.get(farmingController.getPools);

module.exports = { farmingRoute: router }