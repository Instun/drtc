const drtc = require('..');
const cert = require('./cert.json');

drtc.listen({
    port: 60916,
    key: cert.key, cert: cert.cert
}, function (channel) {
    console.log('accept', `${channel.remoteAddress}:${channel.remotePort}`);

    channel.addEventListener("message", function (ev) {
        console.log('message:', ev.data);
        channel.send(ev.data);
    });

    channel.addEventListener("close", (_) => {
        console.log('Data channel closed');
    });
});
