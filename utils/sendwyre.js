const request = require('request');
const crypto = require('crypto');
const querystring = require('querystring');
const url = require('url');

const postData = (path, body, options) => {
    return requestData("POST", path, body, options);
}

const requestData = (method, path, params, options) => {
    if (!path)
        throw new Error("path required");

    let requestOptions = buildRequestOptions(method, path, params, options);

    return new Promise((resolve, reject) => {
        request(requestOptions, (err, res) => {
            if (err)
                throw err;
            else if (res.statusCode >= 200 && res.statusCode < 300)
                resolve(res.body || {});
            else
                reject(res.body || { statusCode: res.statusCode });
        })
    })
}

const buildRequestOptions = (method, path, params, options) => {
    options = options || {};
    let parsedUrl = url.parse(url.resolve('', path), true);
    let json = !(options.headers || {}).hasOwnProperty('Content-Type') || options.headers['Content-Type'] === 'application/json';

    let requestOptions = {
        url: parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname, // no querystring here!
        method: method,
        headers: {
            ...options.headers,
            "X-Api-Key": process.env.APIKEY,
        },
        qs: {
            ...options.qs,
            timestamp: new Date().getTime(),
            format: "jason_numberstring"
        },
        json: json
    };

    if (requestOptions.method === "GET")
        requestOptions.qs = Object.assign(requestOptions.qs, params);
    else
        requestOptions.body = params;

    Object.assign(requestOptions.qs, parsedUrl.query);

    requestOptions.headers["X-Api-Signature"] = buildSignature(requestOptions);

    return requestOptions;
}
const buildSignature = (requestOptions) => {
    let buffers = [];
    const encoding = 'utf8';

    buffers.push(Buffer.from(requestOptions.url.toString(), encoding));
    buffers.push(Buffer.from(requestOptions.url.toString().indexOf('?') < 0 ? "?" : "&", encoding));
    buffers.push(Buffer.from(querystring.stringify(requestOptions.qs), encoding));

    if(requestOptions.body) {
        if(typeof requestOptions.body === 'string')
            buffers.push(Buffer.from(requestOptions.body, encoding));
        else if(requestOptions.body instanceof Buffer)
            buffers.push(requestOptions.body);
        else
            buffers.push(Buffer.from(JSON.stringify(requestOptions.body), encoding));
    }

    return crypto.createHmac("sha256", process.env.SECKEY)
        .update(Buffer.concat(buffers))
        .digest("hex")
}

module.exports = { postData }