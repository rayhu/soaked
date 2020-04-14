# Your app is socked in Web

Socked is a websocket-based solution to publish your applications to Internet.

You run client app on your computer.

Socked server expose clients, let them see each other. It is deployed on
wss://socked.hulaorui.com.

Since it is open source, you can deploy your own server using the same source
code.

## Usage Scenario

Socked can publish your application without public IP address. You don't have to
deal with the firewall or port mapping.

Socked also let your service reachable from any webpage in browser. So that your
service can have a pure webpage/javascript client. It works anywhere without any
client app installed.

### Sample

Suppose you run a local application on computer A and listens to a port 3389.

You run the socked client and let it bridge to port 3389. (client.js)

The client.js opens a websocket connection to wss://socked.hulaorui.com
(server.js)

The webpage on https://socked.hulaorui.com will list your service as remote
desktop over websockets (so it is reachable from webpage in browser)

Your friend can use his browser and connect to wss://websocked.hulaorui.com, all
network packets will be forwarded via the websocket channel to your local
computer.

## Source Code

server.js is deployed on wss://socked.hulaorui.com

client.js is what you can use to bridge your local service to a server channel.

Based on websockets.js Copyright (c) 2011 Einar Otto Stangvik
<einaros@gmail.com> https://github.com/websockets/ws

Copyright (c) 2011 Einar Otto Stangvik <einaros@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

Based on the JavaScript implementation of the websockify WebSocket-to-TCP
bridge/proxy.

Copyright (C) 2013 - Joel Martin (github.com/kanaka)

Licensed under LGPL-3.

See http://github.com/kanaka/websockify for more info.
