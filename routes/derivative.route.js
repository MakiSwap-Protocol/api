const express = require('express');
const router = express.Router();
const { derivativeController } = require('../controllers');

router.route('/contracts')
	.get(derivativeController.getContracts);

router.route('/contract_specs')
	.get(derivativeController.getContractSpecs);

module.exports = { derivativeRoute: router }