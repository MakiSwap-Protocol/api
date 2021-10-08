const axios = require('axios');
const { signature } = require('../utils/signature');
const { ASSETS_URL } = require('../constants/urls');


class earnController {
    async getAssets(req, res, next) {
        try {
            const timestamp = new Date().getTime();
            const fullUrl = `${ASSETS_URL}`;
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
    earnController: new earnController()
}