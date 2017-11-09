import * as WebSocket from 'ws';
import { PlayerKey } from './players';
import { registerRoom, joinRoom, updateScore, RoomId, Room } from './rooms';

const PORT = process.env.PORT ? Number(process.env.PORT) : 1337;
const wss = new WebSocket.Server({ port: PORT });

interface Message {
  event: string;
  data: {
    id: RoomId;
    score?: number;
    playerKey?: PlayerKey;
  };
}

const filterWs = (key: string, value: any) =>
  key === 'ws' ? undefined : value;

const sendEvent = (ws: WebSocket, event: string, data: object) =>
  ws.send(JSON.stringify({ event, data }, filterWs));

const sendError = (ws: WebSocket, errMsg: string) =>
  sendEvent(ws, 'error', { msg: errMsg });

wss.on('connection', async ws => {
  let room: Room | undefined = await registerRoom(ws);

  sendEvent(ws, 'room', room);

  // Message handler
  ws.on('message', async (msg: string) => {
    let decoded: Message;

    try {
      decoded = JSON.parse(msg);
    } catch (e) {
      return sendError(ws, 'Invalid JSON');
    }

    switch (decoded.event) {
      case 'join':
        room = await joinRoom(decoded.data.id, ws);
        if (!room) return sendError(ws, 'Room not found or room is full');

        // Notify player1 with updated Room
        sendEvent(room.player1.ws, 'room', room);

        return sendEvent(ws, 'room', room);
      case 'point':
        if (decoded.data.score === undefined)
          return sendError(ws, 'No score provided!');

        if (
          decoded.data.playerKey !== 'player1' &&
          decoded.data.playerKey !== 'player2'
        )
          return sendError(ws, 'Invalid or missing playerKey!');

        const playerKey: PlayerKey = decoded.data.playerKey;

        room = await updateScore(
          decoded.data.id,
          playerKey,
          decoded.data.score,
        );

        if (!room) {
          return sendError(ws, 'Room not found');
        }

        // Notify other player with updated Room
        const otherPlayerKey: PlayerKey =
          playerKey === 'player1' ? 'player2' : 'player1';

        const otherPlayer = room[otherPlayerKey];
        if (!otherPlayer) {
          return sendError(ws, 'Two players required for point event');
        }

        sendEvent(otherPlayer.ws, 'room', room);

        return sendEvent(ws, 'room', room);
      default:
        sendError(ws, 'Unknown event');
    }
  });
});

console.log(`klockbadis-backend listening on port: ${PORT}`);
