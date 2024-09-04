const drtc = require('..');
const cert = require('./cert.json');

function test_rtc(options) {
    const promise = new Promise((resolve, reject) => {
        console.log("connecting to:", options);

        const connection = drtc.connect(options);

        connection.addEventListener("open", (_) => {
            console.log('connection opened');
            connection.send('hello');
        });

        connection.addEventListener("close", (_) => {
            console.log('connection closed');
            console.log('===================================');
            resolve();
        });

        connection.addEventListener("message", function (ev) {
            console.log('connection message:', ev.data);

            if (ev.data === 'world') {
                connection.close();
            }
            else
                setTimeout(() => {
                    connection.send('world');
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
