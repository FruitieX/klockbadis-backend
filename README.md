klockbadis-backend
==================

Simple backend for keeping track of scores in two-player matches.

Setup
-----

1. `git clone https://github.com/FruitieX/klockbadis-backend.git`
2. `cd klockbadis-backend`
3. `npm install`
4. `npm start`

You can change the listen port by supplying the `PORT` environment variable. Default is `1337`.

Now you can connect to it using websockets, e.g. with [wscat](https://github.com/websockets/wscat):

```
wscat -c ws://localhost:1337
```

Room setup
==========

Player 1
--------

1. Open a websocket connection to server, gets auto-assigned to new room with random PIN.

   Reply:
   ```
   {
     "event": "room",
     "data": {
       "id": "1584",
       "player1": {
         "score": 0
       }
     }
   }
   ```

2. Give PIN to player 2, wait until player 2 connects. Once that happens the following message is received:

   ```
   {
     "event": "room",
     "data": {
       "id": "1584",
       "player1": {
         "score": 0
       },
       "player2": {
         "score": 0
       }
     }
   }
   ```

Player 2
--------

1. Open a websocket connection to server, gets auto-assigned to new room with random PIN.

   Reply:
   ```
   {
     "event": "room",
     "data": {
       "id": "7582",
       "player1": {
         "score":0
       }
     }
   }
   ```

2. Get PIN from player 1, send the following message to join player 1's room:

   ```
   {
     "event": "join",
     "data": {
       "id": "1584"
     }
   }
   ```

Sending updates to score
========================

Player 1 & Player 2
-------------------

Send the following event:

```
{
  "event": "point",
  "data": {
    "id":"1584",
    "playerKey":"player2",
    "score":3
  }
}
```

- `id` is the room ID (PIN code)
- `playerKey` is the player whose score to update
- `score` is the new score
