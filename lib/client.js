const Peer = require('@instun/rtc-dc');

const charset = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');
const genUfrag = (len) => [...Array(len)].fill().map(() => charset.at(Math.floor(Math.random() * charset.length))).join('');

function munge(desc, ufrag) {
    if (desc.sdp === undefined) {
        throw invalidArgument("Can't munge a missing SDP");
    }
    desc.sdp = desc.sdp
        .replace(/\na=ice-ufrag:[^\n]*\n/, '\na=ice-ufrag:' + ufrag + '\n')
        .replace(/\na=ice-pwd:[^\n]*\n/, '\na=ice-pwd:' + ufrag + '\n');
    return desc;
}

function parse_url(url) {
    const re = /^drtc:\/\/(\[[^\]]+\]|[^:\/]+):(\d+)(?:\/([^#]+))?(?:#(.*))?$/;
    const match = url.match(re);
    if (!match) {
        throw new Error('Invalid URL');
    }

    let ip = match[1];
    const port = parseInt(match[2]);
    const fingerprint = match[3];

    if (ip.startsWith('[') && ip.endsWith(']'))
        ip = ip.slice(1, -1);

    return { ip, port, fingerprint };
}

module.exports = function (options, Connection) {
    if (Connection === undefined)
        Connection = RTCPeerConnection;

    if (typeof options === 'string')
        options = parse_url(options);

    var { ip, port, fingerprint } = options;

    const ufrag = 'webrtc+direct+v1/' + genUfrag(16);
    const family = ip.indexOf(':') >= 0 ? 'IP6' : 'IP4';
    fingerprint = fingerprint.match(/.{1,2}/g).join(':').toUpperCase();
    var answerSdp = {
        "type": "answer",
        "sdp": `v=0\r\no=- 0 0 IN ${family} ${ip}\r\ns=-\r\nc=IN ${family} ${ip}\r\nt=0 0\r\na=ice-lite\r\nm=application ${port} UDP/DTLS/SCTP webrtc-datachannel\r\na=mid:0\r\na=setup:passive\r\na=ice-ufrag:${ufrag}\r\na=ice-pwd:${ufrag}\r\na=fingerprint:SHA-256 ${fingerprint}\r\na=sctp-port:5000\r\na=max-message-size:16384\r\na=candidate:1467250027 1 UDP 1467250027 ${ip} ${port} typ host\r\n`
    };

    const connection = new Connection({
        iceUfrag: ufrag,
        icePwd: ufrag,
        maxMessageSize: 16384
    });

    const channel = connection.createDataChannel('dc');

    connection.createOffer().then(offerSdp => {
        const mungedOfferSdp = munge(offerSdp, ufrag);
        connection.setLocalDescription(mungedOfferSdp);

        connection.setRemoteDescription(answerSdp);
    }).catch(e => {
        console.error(e);
    });

    return new Peer({
        channel,
        connection
    });
};
