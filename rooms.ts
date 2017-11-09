import * as WebSocket from 'ws';

import { Player, PlayerKey, createPlayer } from './players';
import { getRoom, createRoom, updateRoom } from './db';

type RoomId = String;

interface Room {
  id: RoomId;
  player1: Player;
  player2?: Player;
}

// Player 1 registers new room
export const registerRoom = async (ws: WebSocket) => {
  const room = await createRoom(createPlayer(ws));
  return room;
};

// Player 2 joins room by PIN code
export const joinRoom = async (roomId: RoomId, ws: WebSocket) => {
  let room = getRoom(roomId);

  if (!room) return;
  if (room.player2) return;

  room = await updateRoom(roomId, { player2: createPlayer(ws) });
  return room;
};

export const updateScore = async (
  roomId: RoomId,
  playerKey: PlayerKey,
  score: number,
) => {
  let room = getRoom(roomId);
  if (!room) return;

  const player = room[playerKey];
  if (!player) return;

  room = await updateRoom(roomId, { [playerKey]: { ...player, score } });
  return room;
};

export { Room, RoomId };
