const axios = require('axios');
const { signature } = require('../utils/signature');
const { POOLS_URL } = require('../constants/urls');


class farmingController {
    async getPools(req, res, next) {
        try {
            const timestamp = new Date().getTime();
            const fullUrl = `${POOLS_URL}`;
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
    farmingController: new farmingController()
}