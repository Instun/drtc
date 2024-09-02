const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const keys = crypto.generateKeyPairSync('ec', {
    namedCurve: 'P-256',
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

console.log("key", keys.privateKey);

var cert = crypto.createCertificateRequest({
    key: keys.privateKey
}).issue({
    key: keys.privateKey,
    days: 365 * 100,
});

console.log("cert", cert.pem);
console.log("fingerprint", cert.fingerprint256.replace(/:/g, '').toLowerCase());

fs.writeFileSync(path.join(__dirname, 'cert.json'), JSON.stringify({
    key: keys.privateKey,
    cert: cert.pem,
    fingerprint: cert.fingerprint256.replace(/:/g, '').toLowerCase()
}, null, 2));
