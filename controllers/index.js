const { spotController } = require('./spot.controller');
const { derivativeController } = require('./derivative.controller');
const { earnController } = require('./earn.controller');
const { farmingController } = require('./farming.controller');
module.exports = {
    spotController,
    derivativeController,
    earnController,
    farmingController
}