const rtc = require('rtc');
const connect = require('./client');

module.exports = {
    connect: function (options, RTCPeerConnection) {
        return connect(options, RTCPeerConnection || rtc.RTCPeerConnection);
    },
    listen: require('./server')
}