import { Client } from 'pg';
import { Tournament, User, UserCreation } from '../types';
import { createHmac } from 'crypto';

const DEFAULT_TOURNAMENT_NAME = 'infinity';

const parseResult = (result: any) => {
  const string = JSON.stringify(result.rows);
  return JSON.parse(string);
};

export const createToken = (p: { name: string; password: string }) => {
  return createHmac('sha256', `${p.name}${p.password}`).digest('hex');
};

export const createUser = (connection: Client, user: UserCreation) => {
  // @TODO Уставновить рейтинг Эло. 1200 [#ratingElo]
  const sqlUserCreate = `
    INSERT INTO users (name, password)
    VALUES
      (
        '${user.name}',
        '${user.password}'
      )
  `;
  return connection.query(sqlUserCreate).then(() =>
    selectUserAfterInsert(connection, user.name).then((userData: any) =>
      selectDefaultTournament(connection).then((defaultTournament: any) => {
        const sqlLinkWithDefaultTournament = `
              INSERT INTO tournaments_per_user (user_id, tournament_id)
              VALUES
                (
                  '${userData.id}',
                  '${defaultTournament.id}'
                )
            `;

        return connection.query(sqlLinkWithDefaultTournament);
      }),
    ),
  );

  // return new Promise((resolve, reject) => {
  //   connection.query(sqlUserCreate, (err) => {
  //     if (err) {
  //       return reject(err);
  //     }
  //
  //     return selectUserAfterInsert(connection, user.name)
  //       .then((userData: any) => {
  //         return selectDefaultTournament(connection)
  //           .then((defaultTournament: any) => {
  //             const sqlLinkWithDefaultTournament = `
  //               INSERT INTO tournaments_per_user (user_id, tournament_id)
  //               VALUES
  //                 (
  //                   '${userData.id}',
  //                   '${defaultTournament.id}'
  //                 )
  //             `;
  //
  //             connection.query(sqlLinkWithDefaultTournament, (err, result) => {
  //               if (err) {
  //                 return reject(err);
  //               }
  //               const tournamentData = parseResult(result)[0];
  //
  //               return resolve({
  //                 user,
  //                 tournamentData,
  //               });
  //             });
  //           })
  //           .catch((err) => {
  //             console.log('err', err);
  //             if (err) {
  //               return reject(err);
  //             }
  //           });
  //       })
  //       .catch((err) => {
  //         console.log('err', err);
  //         if (err) {
  //           return reject(err);
  //         }
  //       });
  //   });
  // });
};

const selectDefaultTournament = (connection: Client) => {
  const sql = `
    SELECT id
    FROM tournament as t
    WHERE t.name = '${DEFAULT_TOURNAMENT_NAME}'
    LIMIT 1
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(parseResult(result)[0]);
    });
  });
};

export const updateUserStats = (
  connection: Client,
  userId: User['id'],
  tournamentId: Tournament['id'],
  stats: { kills: Tournament['kills']; deaths: Tournament['deaths']; points: Tournament['points'] },
) => {
  const sql = `
    UPDATE tournaments_per_user
    SET
      deaths=${stats.deaths},
      kills=${stats.kills},
      points=${stats.points}
    WHERE user_id=${userId} AND tournament_id=${tournamentId};
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(parseResult(result)[0]);
    });
  });
};

export const selectUser = (connection: Client, userId: User['id']) => {
  const sql = `
    SELECT u.id, u.name, u.password, tpr.kills, tpr.deaths, tpr.points
    FROM users as u
    LEFT JOIN tournaments_per_user as tpr ON tpr.user_id = u.id
    WHERE users.id = ${userId}
    LIMIT 1
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(parseResult(result)[0]);
    });
  });
};

export const selectUserByName = (connection: Client, name: User['name']) => {
  const sql = `
    SELECT u.id, u.name, tpr.kills, tpr.deaths, tpr.points
    FROM users as u
    LEFT JOIN tournaments_per_user as tpr ON tpr.user_id = u.id
    WHERE u.name = '${name}'
    LIMIT 1
  `;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(parseResult(result)[0]);
    });
  });
};

export const selectUserByToken = (connection: Client, password: User['password']) => {
  const sql = `
    SELECT u.id, u.name, tpr.kills, tpr.deaths, tpr.points
    FROM users as u
    LEFT JOIN tournaments_per_user as tpr ON tpr.user_id = u.id
    WHERE u.password = '${password}'
    LIMIT 1
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(parseResult(result)[0]);
    });
  });
};

const selectUserAfterInsert = (connection: Client, username: User['name']) => {
  const sql = `
    SELECT u.id, u.name, u.password
    FROM users as u
    WHERE u.name = '${username}'
    LIMIT 1
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(parseResult(result)[0]);
    });
  });
};
