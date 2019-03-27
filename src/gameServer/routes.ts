import * as express from 'express';
import * as Joi from 'joi';
import { State } from './types';
import { mapMap } from '../utils';
import * as game from './games/game';
import { RestartRequest } from './types/api';
import { Cmd } from './commands';
import * as api from './services/main';
import { restartInSeconds } from './reducers';

const secret = '2gistop1';

const restartScheme = Joi.object().keys({
  name: Joi.string()
    .min(1)
    .required(),
  duration: Joi.number()
    .min(0)
    .required(),
  inSeconds: Joi.number()
    .min(0)
    .required(),
  secret: Joi.string()
    .allow(secret)
    .required(),
});

export const applyRoutes = (app: express.Express, state: State, executeCmd: (cmd: Cmd) => void) => {
  // health check для k8s
  app.get('/', (_req, res) => res.sendStatus(200));

  // Metrics
  app.get('/metrics', (_, res) => {
    res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');

    res.send(`# HELP sky_game_active_players Active players in game
  # TYPE sky_game_active_players gauge
  sky_game_active_players ${state.game.players.size}`);
  });

  app.get('/state', (_req, res) => {
    const result = {
      type: state.type,
      url: state.url,
      connections: mapMap(state.connections.map, ({ id, status }) => ({ id, status })),
      game: game.debugInfo(state.game),
    };
    res.send(JSON.stringify(result));
  });

  app.get('/restart', (req, res) => {
    const query = req.query as RestartRequest;

    const { error, value } = restartScheme.validate(query);
    if (error) {
      const msg = `Restart bad request ${error.message}`;
      console.log(msg);
      res.status(400).send(msg);
      return;
    }

    const duration = Number(value.duration) * 60 * 1000;
    const tournamentName = value.name;
    const inSeconds = Number(value.inSeconds);

    api
      .getTournamentList()
      .then((data) => {
        const tournament = data.tournaments.find((t) => t.machine_name === tournamentName);
        if (!tournament) {
          const msg =
            `Tournament with name: ${tournamentName} not found, ` +
            `available names: ${data.tournaments.map((t) => t.machine_name)}`;
          console.log(msg);
          res.status(500).send(msg);
          return;
        }

        const { id, is_grand_final } = tournament;

        console.log(
          `Restart game after ${inSeconds} seconds with tournament id: ${id}, ` +
            `duration: ${duration}, grandFinal: ${is_grand_final}`,
        );
        executeCmd(
          restartInSeconds(state, {
            tournamentId: id,
            duration,
            inSeconds,
            isGrandFinal: is_grand_final,
          }),
        );
        return res.sendStatus(200);
      })
      .catch((reason) => {
        res.status(400).send(reason);
        console.log(`Restart get tournament list error, reason: ${reason}`);
      });
  });
};
