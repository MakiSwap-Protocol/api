const express = require('express');
const router = express.Router();
const { earnController } = require('../controllers');

router.route('/assets')
	.get(earnController.getAssets);

module.exports = { earnRoute: router }