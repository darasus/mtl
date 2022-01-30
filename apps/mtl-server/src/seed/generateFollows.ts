import { TUser } from '@mtl/types';
import cliProgress = require('cli-progress');
import { FollowActions } from '../redis/actions/FollowActions';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const followActions = new FollowActions();

export const generateFollows = async ({
  me,
  users,
}: {
  me: TUser;
  users: TUser[];
}) => {
  let currIndex = 0;

  console.log('Creating follows...');

  const numOfFollows = users.length;

  bar.start(numOfFollows, 0);

  currIndex = 0;

  for (const u of users) {
    bar.update(currIndex + 1);
    await followActions.createFollow({
      followingId: me.id,
      followerId: u.id,
    });
    currIndex++;
  }

  bar.stop();
};
