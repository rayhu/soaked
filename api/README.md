# WebSockets Behavior of Soaked Server

## Start and wait clients to connect

### Handshake

1. On client connect, send server version, server ID.
2. Wait for client to send version, client ID, and a string of client
   description.
3. Set HandShakeComplete=True ws.ClientID=ClientID ws.ClientDescription =
   description
4. Disconnect if not received client ID.

### Get Clients

    Return a list of clients with ID and description.

### Create Pipes

    A put pipes api shall provide client IDs.
    The server shall pipe the two clients if they are both in the right status.
    If succeed, respond with 201 CREATED, otherwise return a 500-series error.

### Encryption

In future, shall send over public key. encrypted by server public key and client
private key

## Test Steps

Two clients can talk to each other via the server.

### Start API

In api folder, execute: npm run dev

### Start Client 1
    In client folder, execute npm run watcher
    This command starts a service listening on 1110.
    It accept stdin, send via socket
    It display received messages on stdout.

    In client folder, execute npm run testlocal
    It bridge the local socket connection to a remove websockets server

### Start Client 2
On another computer run a watcher and another command: node src/client.js
--verbose localhost:1110 ws://192.168.56.1:9998

### Bridge the two clients with a pipe
    Put the pipe via Restful api
    curl --location --request PUT 'localhost:9996/pipes'
    --header 'Content-Type: application/json'
    --data-raw '{
    "client1": "46a935e9-c751-42f9-bf9a-64f82ba9dc79",
    "client2": "e3d2965b-ce3f-41f6-98fc-47ec80fcf1bb"
    }'

### Talk to each other
The watchers can talk to each other now. They don't know each other's IP
address, only an ID. Also no worry about inbound firewall.
