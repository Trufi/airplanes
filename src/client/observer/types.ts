import * as J from '@2gis/jakarta';
import { PlayerState, CameraState, ServerTimeState, NonPhysicBodyState } from '../types';
import { NotesState } from '../common/notes';

export interface ObserverState {
  type: 'observer';
  time: number;
  prevTime: number;

  /**
   * Начало системы отсчета.
   * Нужен для того, чтобы глобальные координаты не выходили за int32 (максимум точности в шейдерах)
   */
  origin: number[];

  players: Map<number, PlayerState>;

  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: CameraState;

  map: J.Map;
  bodies: Map<number, NonPhysicBodyState>;
  serverTime: ServerTimeState;
  pressedKeys: { [key: string]: boolean };

  notes: NotesState;

  callbacks: {
    loopId: number;
    loop: () => void;
    pingId: number;
    ping: () => void;
    resize: () => void;
  };
}
