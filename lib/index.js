const rtc = require('rtc');

module.exports = {
    connect: require('./client')(rtc.RTCPeerConnection),
    listen: require('./server')
}