import { TUser } from '@mtl/types';
import { UserActions } from '../redis/actions/UserActions';
import cliProgress = require('cli-progress');
import * as cuid from 'cuid';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const userActions = new UserActions();

export const generateUsers = async () => {
  let currIndex = 0;

  const user = await userActions.register({
    id: 'ckyjqnwfk0000lq3d7v7z74zw',
    email: 'test@test.com',
    password: 'Password01!',
  });

  const users: TUser[] = [];

  console.log('Creating users...');

  const numOfUsers = 10;

  bar.start(numOfUsers, 0);

  for (const i in Array.from({ length: numOfUsers })) {
    bar.update(currIndex + 1);

    const user = await userActions.register({
      id: cuid(),
      email: `test-${i}@test.com`,
      password: 'Password01!',
    });

    users.push(user);

    currIndex++;
  }

  bar.stop();

  return { me: user, users };
};
