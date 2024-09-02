const rtc = require('rtc');

module.exports = function listen({ port, key, cert }, callback) {
    rtc.listen(port, function (binding) {
        var { local_ufrag, remote_ufrag, address, port } = binding;
        var family = address.indexOf(':') >= 0 ? 'IP6' : 'IP4';

        const peer = new rtc.RTCPeerConnection({
            enableIceUdpMux: true,
            disableFingerprintVerification: true,
            iceUfrag: local_ufrag,
            icePwd: local_ufrag,
            certPem: cert,
            keyPem: key,
            maxMessageSize: 16384
        });

        const sdp = `v=0\r\no=- 0 0 IN ${family} ${address}\r\ns=-\r\nc=IN ${family} ${address}\r\nt=0 0\r\na=ice-lite\r\nm=application ${port} UDP/DTLS/SCTP webrtc-datachannel\r\na=mid:0\r\na=setup:active\r\na=ice-ufrag:${remote_ufrag}\r\na=ice-pwd:${remote_ufrag}\r\na=fingerprint:SHA-256 00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00\r\na=sctp-port:5000\r\na=max-message-size:16384\r\na=candidate:1467250027 1 UDP 1467250027 ${address} ${port} typ host\r\n`;

        peer.setRemoteDescription({
            "type": "offer",
            "sdp": sdp
        });

        peer.ondatachannel = function (ev) {
            ev.channel.remoteAddress = address;
            ev.channel.remotePort = port;

            callback(ev.channel);
        };
    });
};