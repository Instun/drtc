# @instun/drtc

## Overview

`@instun/drtc` stands for WebRTC Direct. It is a powerful and flexible library designed to simplify the process of establishing WebRTC data channels with direct peer-to-peer connections. By leveraging the capabilities of the `rtc` and `@instun/rtc-dc` packages, `@instun/drtc` provides a streamlined API for creating and managing peer-to-peer connections, making it easier for developers to build real-time communication applications.

WebRTC (Web Real-Time Communication) is a technology that enables peer-to-peer communication directly between browsers and devices. It is widely used for applications such as video conferencing, file sharing, and real-time data exchange. However, setting up and managing WebRTC connections can be complex due to the intricacies of signaling, ICE (Interactive Connectivity Establishment), and SDP (Session Description Protocol) handling.

`@instun/drtc` abstracts away much of this complexity, allowing developers to focus on building their applications rather than dealing with the low-level details of WebRTC. With `@instun/drtc`, you can easily create servers that listen for incoming connections and clients that connect to these servers, all while benefiting from the robustness and efficiency of WebRTC technology.

## Features

`@instun/drtc` offers a rich set of features that make it a versatile choice for developers looking to implement WebRTC-based solutions. Here are some of the key features:

- **Establish WebRTC Data Channels**: `@instun/drtc` simplifies the process of setting up WebRTC data channels, enabling direct peer-to-peer communication for real-time data exchange. Whether you are building a chat application, a multiplayer game, or a file-sharing service, `@instun/drtc` provides the tools you need to get started quickly.

- **Support for ICE Lite**: ICE (Interactive Connectivity Establishment) is a framework used to find the best path to connect peers. `@instun/drtc` supports ICE Lite, a simplified version of ICE that is ideal for scenarios where one peer is on a public IP address and the other is behind a NAT (Network Address Translation). This support ensures that connections are established efficiently and reliably.

- **Customizable SDP Munging**: SDP (Session Description Protocol) is used to describe multimedia communication sessions. `@instun/drtc` allows for customizable SDP munging, giving developers the flexibility to modify SDP attributes as needed. This feature is particularly useful for optimizing connection parameters and ensuring compatibility with different WebRTC implementations.

- **Event-Driven Architecture**: Built on top of `eventemitter3`, `@instun/drtc` follows an event-driven architecture that makes it easy to handle various connection events. Developers can listen for events such as `open`, `message`, and `close` to manage the connection lifecycle and respond to incoming data.


- **Secure Connections**: Security is a critical aspect of any real-time communication application. WebRTC is based on DTLS (Datagram Transport Layer Security), which provides encryption, message authentication, and integrity. `@instun/drtc` supports secure connections using DTLS, ensuring that data exchanged between peers is encrypted and protected from eavesdropping and tampering. Additionally, the library allows the use of PEM-encoded certificates and private keys for further security customization.

- **Flexible Connection Options**: `@instun/drtc` provides flexible connection options, allowing clients to connect to servers using either an options object or a URL string. This flexibility makes it easier to integrate `@instun/drtc` into various application architectures and deployment scenarios.

- **Cross-Platform Compatibility**: `@instun/drtc` is designed to work seamlessly across different platforms, including browsers and Node.js environments. This cross-platform compatibility ensures that your WebRTC-based applications can reach a wide audience, regardless of the devices they use.

- **Ease of Use**: With its intuitive API and comprehensive documentation, `@instun/drtc` is easy to use, even for developers who are new to WebRTC. The library abstracts away the complexities of WebRTC, allowing you to focus on building your application’s core functionality.

In summary, `@instun/drtc` is a comprehensive library that simplifies the process of establishing and managing WebRTC data channels. Its rich feature set, combined with ease of use and flexibility, makes it an excellent choice for developers looking to build real-time communication applications.

## Installation

To install the library, use npm:

```sh
fibjs --install @instun/drtc
```

## Usage

### Server

To create a server that listens for incoming connections, use the `listen`:

```js
const { listen } = require('@instun/drtc');

const key = `-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----`;

const cert = `-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----`;

listen({ port: 60916, key: key, cert: cert }, (peer) => {
    console.log('New peer connected:', peer.remoteAddress, peer.remotePort);

    peer.on('message', (message) => {
        console.log('Received message:', message);
    });

    peer.send('Hello, client!');
});
```

### Client

To create a client that connects to a server, use the `connect` function:

```js
const { connect } = require('@instun/drtc');

const options = {
    ip: '127.0.0.1',
    port: 60916,
    fingerprint: '42cb5f89e381f2fdb4f659e2491d93cb33be36ddf5198f1c932886aa3697e927'
};

const peer = connect(options);

peer.on('open', () => {
    console.log('Connection opened');
    peer.send('Hello, server!');
});

peer.on('message', (message) => {
    console.log('Received message:', message);
});

peer.on('close', () => {
    console.log('Connection closed');
});
```

### Testing

To run the tests, use the following command:

```sh
npm test
```

The tests are located in the `test` directory and include both client and server tests.

## API

### `listen(options, callback)`

- `options`: An object containing the following properties:
  - `port`: The port to listen on.
  - `key`: The PEM string of the private key.
  - `cert`: The PEM string of the certificate.
- `callback`: A function that is called when a new peer connects. The peer object is passed as an argument to the callback.

### `connect(optionsOrUrl)`

- `optionsOrUrl`: Either an object containing the following properties:
  - `ip`: The IP address of the server.
  - `port`: The port of the server.
  - `fingerprint`: The fingerprint of the server's certificate.
  Or a URL string in the format `drtc://<ip>:<port>/<fingerprint>`.
- Returns a `Peer` object.

### `Peer`

The `Peer` class extends `EventEmitter` and provides the following methods:

- `send(data)`: Sends data to the remote peer.
- `close()`: Closes the connection.

The `Peer` class emits the following events:

- `open`: Emitted when the connection is opened.
- `message`: Emitted when a message is received from the remote peer.
- `close`: Emitted when the connection is closed.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
