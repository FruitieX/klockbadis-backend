import { Room, RoomId } from './rooms';
import { Player } from './players';
import { shuffle, range, padStart } from 'lodash';

const numRooms = 10000;
let currentId = -1;

// Generate all 4-digit pin codes
const pinCodes = shuffle(range(numRooms)).map(id =>
  padStart(String(id), 4, '0'),
);

const getNextPIN = () => {
  currentId = (currentId + 1) % pinCodes.length;

  return pinCodes[currentId];
};

let rooms: Room[] = [];

export const getRooms = (): Room[] => rooms;
export const getRoom = (roomId: RoomId): Room | undefined =>
  rooms.find(room => room.id === roomId);

// Creates a new room, adds player1 to it
export const createRoom = (player1: Player): Room => {
  const room = {
    id: getNextPIN(),
    player1,
  };

  rooms.unshift(room);
  rooms = rooms.slice(0, numRooms);

  return room;
};

// Updates given fields in room
export const updateRoom = (
  roomId: RoomId,
  fields: Partial<Room>,
): Room | undefined => {
  const room = getRoom(roomId);

  if (!room) {
    return;
  }

  const index = rooms.findIndex(room => room.id === roomId);

  rooms[index] = {
    ...room,
    ...fields,
  };

  return rooms[index];
};
