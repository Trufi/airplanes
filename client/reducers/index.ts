import { State, NonPhysicBodyState, PlayerState } from '../types';
import { createMesh } from '../view';
import { AnyServerMsg, ServerMsg, TickBodyData, AnotherPlayer } from '../../server/messages';

export const message = (state: State, msg: AnyServerMsg) => {
  switch (msg.type) {
    case 'startData':
      createSession(state, msg);
      break;
    case 'tickData':
      updateGameData(state, msg);
      break;
    case 'playerEnter':
      createPlayer(state, msg);
      break;
    case 'playerLeave':
      removePlayer(state, msg);
      break;
  }
};

const createSession = (state: State, msg: ServerMsg['startData']) => {
  state.session = {
    id: msg.id,
    body: {
      position: msg.body.position,
      velocity: msg.body.velocity,
      quaternion: msg.body.quaternion,
      mesh: createMesh(),
    },
  };

  state.scene.add(state.session.body.mesh);

  msg.anotherPlayers.forEach((anotherPlayer) => {
    createPlayer(state, anotherPlayer);
  });
};

const updateGameData = (state: State, msg: ServerMsg['tickData']) => {
  msg.bodies.forEach((body) => updateBodyData(state, body));
};

const updateBodyData = (state: State, data: TickBodyData) => {
  const { id, position, quaternion, updateTime } = data;

  // Собственный самолет не обновляем
  if (state.session && state.session.id === id) {
    return;
  }

  const bodyState = state.bodies.get(id);
  if (!bodyState) {
    return;
  }

  bodyState.steps.push({
    position,
    quaternion,
    time: updateTime,
  });
};

const createPlayer = (state: State, { id, name, bodyId }: AnotherPlayer) => {
  createBody(state, id, bodyId);

  const player: PlayerState = {
    id,
    bodyId,
    name,
  };
  state.players.set(player.id, player);
};

const createBody = (state: State, playerId: number, id: number) => {
  const body: NonPhysicBodyState = {
    id,
    playerId,
    position: [0, 0, 0],
    quaternion: [0, 0, 0, 1],
    steps: [],
    mesh: createMesh(),
  };
  state.bodies.set(id, body);
  state.scene.add(body.mesh);
};

const removePlayer = (state: State, msg: ServerMsg['playerLeave']) => {
  const player = state.players.get(msg.playerId);
  if (!player) {
    return;
  }
  const body = state.bodies.get(player.bodyId);
  if (body) {
    state.bodies.delete(player.bodyId);
    state.scene.remove(body);
  }
  state.players.delete(player.id);
};
