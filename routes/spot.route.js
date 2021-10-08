const express = require('express');
const router = express.Router();
const { spotController } = require('../controllers');

router.route('/pairs')
    .get(spotController.getPairs);

router.route('/tickers')
    .get(spotController.getTickers);

router.route('/orderbook')
    .get(spotController.getOrderBook)

router.route('/historical_trades')
    .get(spotController.getTrades)

module.exports = { authRoute: router }