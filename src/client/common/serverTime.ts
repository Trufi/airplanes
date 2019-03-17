import { time, median, p90 } from '../utils';
import { ServerMsg } from '../../server/messages';
import * as config from '../../config';
import { clamp, lerp } from '../../utils';

export const createServerTimeState = (time: number) => ({
  diffSample: [] as number[],
  diff: 0,

  pingSample: [] as number[],
  ping: 300,

  smoothPing: {
    value: 300,
    time,
    from: {
      time,
      value: 300,
    },
    to: {
      time,
      value: 300,
    },
  },
});

export type ServerTimeState = ReturnType<typeof createServerTimeState>;

export const updatePingAndServerTime = (timeState: ServerTimeState, msg: ServerMsg['pong']) => {
  const { pingSample, diffSample } = timeState;
  const maxSampleLength = 100;

  const now = time();
  const ping = now - msg.clientTime;

  pingSample.push(ping);
  if (pingSample.length > maxSampleLength) {
    pingSample.shift();
  }

  timeState.ping = median(pingSample);

  setSmoothInterp(timeState, now + config.smoothPingTime, p90(pingSample));

  const diff = msg.clientTime + ping / 2 - msg.serverTime;
  diffSample.push(diff);
  if (diffSample.length > maxSampleLength) {
    diffSample.shift();
  }

  timeState.diff = median(diffSample);
};

/**
 * @param toTime Тут должно приходить время клиента! Не сервера!
 */
const setSmoothInterp = (state: ServerTimeState, toTime: number, toValue: number) => {
  const { smoothPing } = state;
  smoothPing.from.value = smoothPing.value;
  smoothPing.from.time = smoothPing.time;

  smoothPing.to.value = toValue;
  smoothPing.to.time = toTime;
};

/**
 * @param time Тут должно приходить время клиента! Не сервера!
 */
export const updateSmoothPing = (state: ServerTimeState, time: number) => {
  const { smoothPing } = state;

  const t = clamp(
    (time - smoothPing.from.time) / (smoothPing.to.time - smoothPing.from.time),
    0,
    1,
  );

  smoothPing.value = lerp(smoothPing.from.value, smoothPing.to.value, t);
  smoothPing.time = time;
};

export const interpolateTimeShift = (state: ServerTimeState) => {
  return (
    state.smoothPing.value * 2 + config.clientSendChangesInterval + config.serverGameStep + 100
  );
};
