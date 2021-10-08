const axios = require('axios');
const { signature } = require('../utils/signature');
const { CONTRACTS_URL, CONTRACT_SPECS_URL } = require('../constants/urls');

class derivativeController {
    async getContracts(req, res, next) {
        try {
            const timestamp = new Date().getTime();
            const fullUrl = `/${CONTRACTS_URL}`;
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
            res.status(400).send(error.response.data);
            return;
        }
        return;
    }

    async getContractSpecs(req, res, next) {
        try {
            const fullUrl = `${CONTRACT_SPECS_URL}`;
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
            res.status(400).send(error.response.data);
            return;
        }
        return;
    }
}

module.exports = {
    derivativeController: new derivativeController()
}