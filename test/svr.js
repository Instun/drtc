const drtc = require('..');
const cert = require('./cert.json');

drtc.listen({
    port: 60916,
    key: cert.key, cert: cert.cert
}, function (connection) {
    console.log('=================> accept', `${connection.remoteAddress}:${connection.remotePort}`);

    connection.addEventListener("message", function (ev) {
        console.log('received', ev.data);
        connection.send(ev.data);
    });

    connection.addEventListener("close", (_) => {
        console.log('connection closed');
    });
});
