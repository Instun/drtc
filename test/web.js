(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // lib/client.js
  var require_client = __commonJS({
    "lib/client.js"(exports, module) {
      var charset = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
      var genUfrag = (len) => [...Array(len)].map(() => charset.at(Math.floor(Math.random() * charset.length))).join("");
      function munge(desc, ufrag) {
        if (desc.sdp === void 0) {
          throw invalidArgument("Can't munge a missing SDP");
        }
        desc.sdp = desc.sdp.replace(/\na=ice-ufrag:[^\n]*\n/, "\na=ice-ufrag:" + ufrag + "\n").replace(/\na=ice-pwd:[^\n]*\n/, "\na=ice-pwd:" + ufrag + "\n");
        return desc;
      }
      function parse_url(url) {
        const re = /^drtc:\/\/(\[[^\]]+\]|[^:\/]+):(\d+)(?:\/([^#]+))?(?:#(.*))?$/;
        const match = url.match(re);
        if (!match) {
          throw new Error("Invalid URL");
        }
        let ip = match[1];
        const port = parseInt(match[2]);
        const fingerprint = match[3];
        if (ip.startsWith("[") && ip.endsWith("]"))
          ip = ip.slice(1, -1);
        return { ip, port, fingerprint };
      }
      module.exports = function(RTCPeerConnection2) {
        return function(options) {
          if (typeof options === "string")
            options = parse_url(options);
          var { ip, port, fingerprint } = options;
          const ufrag = "webrtc+direct+v1/" + genUfrag(16);
          const family = ip.indexOf(":") >= 0 ? "IP6" : "IP4";
          fingerprint = fingerprint.match(/.{1,2}/g).join(":").toUpperCase();
          var answerSdp = {
            "type": "answer",
            "sdp": `v=0\r
o=- 0 0 IN ${family} ${ip}\r
s=-\r
c=IN ${family} ${ip}\r
t=0 0\r
a=ice-lite\r
m=application ${port} UDP/DTLS/SCTP webrtc-datachannel\r
a=mid:0\r
a=setup:passive\r
a=ice-ufrag:${ufrag}\r
a=ice-pwd:${ufrag}\r
a=fingerprint:SHA-256 ${fingerprint}\r
a=sctp-port:5000\r
a=max-message-size:16384\r
a=candidate:1467250027 1 UDP 1467250027 ${ip} ${port} typ host\r
`
          };
          const connection = new RTCPeerConnection2({
            iceUfrag: ufrag,
            icePwd: ufrag,
            maxMessageSize: 16384
          });
          const channel = connection.createDataChannel("dc");
          connection.createOffer().then((offerSdp) => {
            const mungedOfferSdp = munge(offerSdp, ufrag);
            connection.setLocalDescription(mungedOfferSdp);
            connection.setRemoteDescription(answerSdp);
          }).catch((e) => {
            console.error(e);
          });
          return {
            channel,
            connection
          };
        };
      };
    }
  });

  // lib/web.js
  var require_web = __commonJS({
    "lib/web.js"(exports, module) {
      module.exports = {
        connect: require_client()(RTCPeerConnection)
      };
    }
  });

  // test/cert.json
  var require_cert = __commonJS({
    "test/cert.json"(exports, module) {
      module.exports = {
        key: "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgYJwyDkfOiMe0+GdJ\njkr9tEnQfI5bqdV4BNd9MuLQBCmhRANCAAQ9YCLbEB062IrEr5fo9xOITAvWZQ6u\n7erspD/wrbT0qTBbnLpmY2FItWedeblaif77zRTO+gLlxoivH3eHmOWO\n-----END PRIVATE KEY-----\n",
        cert: "-----BEGIN CERTIFICATE-----\nMIIBCDCBr6ADAgECAgkAiU64ogOw8s4wCgYIKoZIzj0EAwIwADAgFw0yNDA5MDIx\nOTI4MDFaGA8yMTI0MDgwOTE5MjgwMVowADBZMBMGByqGSM49AgEGCCqGSM49AwEH\nA0IABD1gItsQHTrYisSvl+j3E4hMC9ZlDq7t6uykP/CttPSpMFucumZjYUi1Z515\nuVqJ/vvNFM76AuXGiK8fd4eY5Y6jEDAOMAwGA1UdEwEB/wQCMAAwCgYIKoZIzj0E\nAwIDSAAwRQIhAIaQ0eus5rkZ7YS4L2/OHtae2/yNT+vqvQ7zo17jFKFdAiAKWg/R\nXvT1Pvb0NGwVqiOS+jCIJEwpo/otvGOOq0WMcw==\n-----END CERTIFICATE-----\n",
        fingerprint: "42cb5f89e381f2fdb4f659e2491d93cb33be36ddf5198f1c932886aa3697e927"
      };
    }
  });

  // test/client.js
  var drtc = require_web();
  var cert = require_cert();
  function test_rtc(options) {
    const promise = new Promise((resolve, reject) => {
      console.log("connecting to:", options);
      const { channel, connection } = drtc.connect(options);
      connection.addEventListener("connectionstatechange", (_) => {
        console.log("state", connection.connectionState);
      });
      channel.addEventListener("open", (_) => {
        console.log("Data channel opened");
        channel.send("hello");
      });
      channel.addEventListener("closing", (_) => {
        console.log("Data channel closing");
      });
      channel.addEventListener("close", (_) => {
        console.log("Data channel closed");
      });
      channel.addEventListener("error", function(ev) {
        console.log("Data channel error:", ev);
      });
      channel.addEventListener("message", function(ev) {
        console.log("Data channel message:", ev.data);
        if (ev.data === "world") {
          console.log("===================================");
          connection.close();
          resolve();
        } else
          setTimeout(() => {
            channel.send("world");
          }, 1e3);
      });
    });
    return promise;
  }
  async function tests() {
    await test_rtc({
      ip: "127.0.0.1",
      port: 60916,
      fingerprint: cert.fingerprint
    });
    await test_rtc(`drtc://127.0.0.1:60916/${cert.fingerprint}`);
    await test_rtc(`drtc://localhost:60916/${cert.fingerprint}`);
    await test_rtc(`drtc://[::1]:60916/${cert.fingerprint}`);
  }
  tests();
})();
