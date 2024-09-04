(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/eventemitter3/index.js
  var require_eventemitter3 = __commonJS({
    "node_modules/eventemitter3/index.js"(exports, module) {
      "use strict";
      var has = Object.prototype.hasOwnProperty;
      var prefix = "~";
      function Events() {
      }
      if (Object.create) {
        Events.prototype = /* @__PURE__ */ Object.create(null);
        if (!new Events().__proto__) prefix = false;
      }
      function EE(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
      }
      function addListener(emitter, event, fn, context, once) {
        if (typeof fn !== "function") {
          throw new TypeError("The listener must be a function");
        }
        var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
        if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
        else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
        else emitter._events[evt] = [emitter._events[evt], listener];
        return emitter;
      }
      function clearEvent(emitter, evt) {
        if (--emitter._eventsCount === 0) emitter._events = new Events();
        else delete emitter._events[evt];
      }
      function EventEmitter() {
        this._events = new Events();
        this._eventsCount = 0;
      }
      EventEmitter.prototype.eventNames = function eventNames() {
        var names = [], events, name;
        if (this._eventsCount === 0) return names;
        for (name in events = this._events) {
          if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
        }
        if (Object.getOwnPropertySymbols) {
          return names.concat(Object.getOwnPropertySymbols(events));
        }
        return names;
      };
      EventEmitter.prototype.listeners = function listeners(event) {
        var evt = prefix ? prefix + event : event, handlers = this._events[evt];
        if (!handlers) return [];
        if (handlers.fn) return [handlers.fn];
        for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
          ee[i] = handlers[i].fn;
        }
        return ee;
      };
      EventEmitter.prototype.listenerCount = function listenerCount(event) {
        var evt = prefix ? prefix + event : event, listeners = this._events[evt];
        if (!listeners) return 0;
        if (listeners.fn) return 1;
        return listeners.length;
      };
      EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return false;
        var listeners = this._events[evt], len = arguments.length, args, i;
        if (listeners.fn) {
          if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
          switch (len) {
            case 1:
              return listeners.fn.call(listeners.context), true;
            case 2:
              return listeners.fn.call(listeners.context, a1), true;
            case 3:
              return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
              return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
          }
          for (i = 1, args = new Array(len - 1); i < len; i++) {
            args[i - 1] = arguments[i];
          }
          listeners.fn.apply(listeners.context, args);
        } else {
          var length = listeners.length, j;
          for (i = 0; i < length; i++) {
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
            switch (len) {
              case 1:
                listeners[i].fn.call(listeners[i].context);
                break;
              case 2:
                listeners[i].fn.call(listeners[i].context, a1);
                break;
              case 3:
                listeners[i].fn.call(listeners[i].context, a1, a2);
                break;
              case 4:
                listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                break;
              default:
                if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
                listeners[i].fn.apply(listeners[i].context, args);
            }
          }
        }
        return true;
      };
      EventEmitter.prototype.on = function on(event, fn, context) {
        return addListener(this, event, fn, context, false);
      };
      EventEmitter.prototype.once = function once(event, fn, context) {
        return addListener(this, event, fn, context, true);
      };
      EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return this;
        if (!fn) {
          clearEvent(this, evt);
          return this;
        }
        var listeners = this._events[evt];
        if (listeners.fn) {
          if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
            clearEvent(this, evt);
          }
        } else {
          for (var i = 0, events = [], length = listeners.length; i < length; i++) {
            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
              events.push(listeners[i]);
            }
          }
          if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
          else clearEvent(this, evt);
        }
        return this;
      };
      EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
        var evt;
        if (event) {
          evt = prefix ? prefix + event : event;
          if (this._events[evt]) clearEvent(this, evt);
        } else {
          this._events = new Events();
          this._eventsCount = 0;
        }
        return this;
      };
      EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
      EventEmitter.prototype.addListener = EventEmitter.prototype.on;
      EventEmitter.prefixed = prefix;
      EventEmitter.EventEmitter = EventEmitter;
      if ("undefined" !== typeof module) {
        module.exports = EventEmitter;
      }
    }
  });

  // node_modules/@instun/rtc-dc/index.js
  var require_rtc_dc = __commonJS({
    "node_modules/@instun/rtc-dc/index.js"(exports, module) {
      var events = require_eventemitter3();
      var disconnect_states = {
        closed: true,
        failed: true,
        disconnected: true
      };
      module.exports = class Peer extends events.EventEmitter {
        constructor(options) {
          super();
          this.connection = options.connection;
          this.channel = options.channel;
          let closed = false;
          let This = this;
          function close() {
            if (closed) return;
            closed = true;
            This.emit("close");
            This.connection.close();
          }
          this.connection.addEventListener("connectionstatechange", function() {
            if (This.connection.connectionState in disconnect_states)
              close();
          });
          this.channel.addEventListener("close", close);
          this.channel.addEventListener("error", close);
          this.channel.addEventListener("open", function() {
            This.emit("open");
          });
          this.channel.addEventListener("message", function(ev) {
            This.emit("message", ev);
          });
        }
        addEventListener(event, listener) {
          this.addListener(event, listener);
        }
        removeEventListener(event, listener) {
          this.removeListener(event, listener);
        }
        send(data) {
          this.channel.send(data);
        }
        close() {
          this.connection.close();
        }
      };
    }
  });

  // lib/client.js
  var require_client = __commonJS({
    "lib/client.js"(exports, module) {
      var Peer = require_rtc_dc();
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
      module.exports = function(options, Connection) {
        if (Connection === void 0)
          Connection = RTCPeerConnection;
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
        const connection = new Connection({
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
        return new Peer({
          channel,
          connection
        });
      };
    }
  });

  // lib/web.js
  var require_web = __commonJS({
    "lib/web.js"(exports, module) {
      module.exports = {
        connect: require_client()
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
      const connection = drtc.connect(options);
      connection.addEventListener("open", (_) => {
        console.log("connection opened");
        connection.send("hello");
      });
      connection.addEventListener("close", (_) => {
        console.log("connection closed");
        console.log("===================================");
        resolve();
      });
      connection.addEventListener("message", function(ev) {
        console.log("connection message:", ev.data);
        if (ev.data === "world") {
          connection.close();
        } else
          setTimeout(() => {
            connection.send("world");
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
