const axios = require('axios');
const { signature } = require('../utils/signature');
const { PAIR_URL, TICKERS_URL, ORDERBOOK_URL, TRADES_URL } = require('../constants/urls');

class spotController {
    async getPairs(req, res, next) {
        try {

            const timestamp = new Date().getTime();
            const fullUrl = `${PAIR_URL}`;
            const headers = {};
            const details = "";
            headers['Content-Type'] = 'application/json';
            headers['X-Api-Signature'] = signature(fullUrl, details);

            const config = {
                method: "GET",
                url: fullUrl,
                headers: headers,
            }

            const response = await axios(config);
            res.send(response.data);

        } catch (error) {
            res.status(400).send(error);
            return;
        }
        return;
    }
    async getTickers(req, res, next) {
        try {

            const timestamp = new Date().getTime();
            const fullUrl = `${TICKERS_URL}`;
            const headers = {};
            const details = "";
            headers['Content-Type'] = 'application/json';
            headers['X-Api-Signature'] = signature(fullUrl, details);

            const config = {
                method: "GET",
                url: fullUrl,
                headers: headers,
            }

            const response = await axios(config);
            res.send(response.data);

        } catch (error) {
            res.status(400).send(error);
            return;
        }
        return;
    }
    async getOrderBook(req, res, next) {
        try {

            const timestamp = new Date().getTime();
            const fullUrl = `${ORDERBOOK_URL}`;
            const headers = {};
            const details = "";
            headers['Content-Type'] = 'application/json';
            headers['X-Api-Signature'] = signature(fullUrl, details);

            const config = {
                method: "GET",
                url: fullUrl,
                headers: headers,
            }

            const response = await axios(config);
            res.send(response.data);

        } catch (error) {
            res.status(400).send(error);
            return;
        }
        return;
    }
    async getTrades(req, res, next) {
        try {

            const timestamp = new Date().getTime();
            const fullUrl = `${TRADES_URL}`;
            const headers = {};
            const details = "";
            headers['Content-Type'] = 'application/json';
            headers['X-Api-Signature'] = signature(fullUrl, details);

            const config = {
                method: "GET",
                url: fullUrl,
                headers: headers,
            }

            const response = await axios(config);
            res.send(response.data);

        } catch (error) {
            res.status(400).send(error);
            return;
        }
        return;
    }
}

module.exports = {
    spotController: new spotController()
}