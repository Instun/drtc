const drtc = require('..');
const cert = require('./cert.json');

drtc.listen({
    port: 60916,
    key: cert.key, cert: cert.cert
}, function (channel) {
    console.log('accept', `${channel.remoteAddress}:${channel.remotePort}`);

    channel.onmessage = function (ev) {
        console.log('message:', ev.data);
        channel.send(ev.data);
    }

    channel.onclose = (_) => {
        console.log('Data channel closed');
    };
});
