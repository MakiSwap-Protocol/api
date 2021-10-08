const CryptoJS = require('crypto-js');

const signature = (url, data) => {
    const signData = url + data;
    const signatureToken = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(signData.toString(CryptoJS.enc.Utf8), process.env.SECKEY));
    return signatureToken;
}

module.exports = { signature }