# Your App is Soaked in Web

Soaked is a websocket-based solution to publish your applications to Internet.

Many traditional applications listens on non-HTTP ports, thus require a native app as client, now the communication is substitued by websocket, you can use a  webpage to replace your native clients.

## How it works

You run Soaked client on your computer and bridge to your local port. 

Soaked client connects to Soaked server, establish a duplex channel using websockets.

Soaked server exposes your own app to Internet via HTTPS/WSS protocols, it also handles service discovery, encryption, and inbound connection. The benefits are enomous, your client app can be a webpage, it can be discovered with search engine, it is very secure, and you don't have to care about the firewall trouble anymore.

Your application will be empowered by the web technology.
* Be accessed by a browser instead of a native app.
* Encrypted and authenticated.
* Inbound connection, no need to worry about your private IP address or configure port mapping.

You don't have to write a native app as your application's client, webpage can be your client. 

Think about Remote Desktop, VNC, DNS, BitTorrent, ShadowSocks and MQTT, all the non-HTTP protocols now is Soaked in web.


## Usage Scenario

Soaked can publish your application without public IP address. You don't have to
deal with the firewall or port mapping.

Soaked also let your service reachable from any webpage in browser. So that your
service can have a pure webpage/javascript client. It works anywhere without any
client app installed.

### Sample

Suppose you run a local application on computer A and listens to a port 3389.

You run the Soaked client and let it bridge to port 3389. (client.js)

The client.js opens a websocket connection to the default service wss://soaked.hulaorui.com:9999 which is handled by server.js.

The [Soaked server](https://soaked.hulaorui.com) will list your service as remote
desktop over websockets (so it is reachable from webpage in browser)

While you are out, you can visit your home via a browser by connecting to wss://soaked.hulaorui.com, all network packets will be forwarded via the websocket channel to your local computer.

You don't need to install RDP client such as [Remmina](https://gitlab.com/Remmina/Remmina), a webpage will display your home desktop.


## Source Code

Please copy the config.yml.example as config.yml

server.js is deployed on wss://Soaked.hulaorui.com as described in config.yml

client.js is what you can use to bridge your local service to a server channel.

If you run from source code, execute: 
```
node client.js port
```

Otherwise, run one of the executables in the release page
```
Soaked.exe <PORT>
```

If you build from source code, the executables are in the builds folder.

The default Soaked server is wss://soaked.hulaorui.com.

Since it is open source, you can deploy your own server using the same source
code.

## Credit


Based on websockets.js Copyright (c) 2011 Einar Otto Stangvik
<einaros@gmail.com> https://github.com/websockets/ws

Copyright (c) 2011 Einar Otto Stangvik <einaros@gmail.com>


Inspired by the JavaScript implementation of the websockify WebSocket-to-TCP
bridge/proxy.

Copyright (C) 2013 - Joel Martin (github.com/kanaka)

Licensed under LGPL-3.

See http://github.com/kanaka/websockify for more info.
