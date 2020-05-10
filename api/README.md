# WebSockets Behavior of Soaked  Server

## Start and wait clients to connect

Handshake
=========

1. On client connect, send server version, server ID.
2. Wait for client to send version, client ID, and a string of client description.
3. Set
    HandShakeComplete=True
    ws.ClientID=ClientID
    ws.ClientDescription = description
4. Disconnect if not received client ID.

Get Clients
==========

    Return a list of clients with ID and description.

Create Pipes
============

    A put pipes api shall provide client IDs.
    The server shall pipe the two clients if they are both in the right status.  
    If succeed, respond with 201 CREATED, otherwise return a 500-series error.

## Encryption

In future, shall send over public key.
encrypted by server public key and client private key
