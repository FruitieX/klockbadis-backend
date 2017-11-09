import * as WebSocket from 'ws';

interface Player {
  score: number;
  ws: WebSocket;
}

type PlayerKey = 'player1' | 'player2';

const createPlayer = (ws: WebSocket): Player => ({
  score: 0,
  ws,
});

export { Player, PlayerKey, createPlayer };
