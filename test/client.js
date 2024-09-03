const drtc = require('..');
const cert = require('./cert.json');

function test_rtc(options) {
    const promise = new Promise((resolve, reject) => {
        console.log("connecting to:", options);

        const { channel, connection } = drtc.connect(options);

        connection.addEventListener("connectionstatechange", (_) => {
            console.log('state', connection.connectionState);
        });

        channel.addEventListener("open", (_) => {
            console.log('Data channel opened');
            channel.send('hello');
        });

        channel.addEventListener("closing", (_) => {
            console.log('Data channel closing');
        });

        channel.addEventListener("close", (_) => {
            console.log('Data channel closed');
        });

        channel.addEventListener("error", function (ev) {
            console.log('Data channel error:', ev);
        });

        channel.addEventListener("message", function (ev) {
            console.log('Data channel message:', ev.data);

            if (ev.data === 'world') {
                console.log('===================================');
                connection.close();
                resolve();
            }
            else
                setTimeout(() => {
                    channel.send('world');
                }, 1000);
        });
    });

    return promise;
}

async function tests() {
    await test_rtc({
        ip: '127.0.0.1',
        port: 60916,
        fingerprint: cert.fingerprint
    });

    await test_rtc(`drtc://127.0.0.1:60916/${cert.fingerprint}`);
    await test_rtc(`drtc://localhost:60916/${cert.fingerprint}`);
    await test_rtc(`drtc://[::1]:60916/${cert.fingerprint}`);
}

tests();
