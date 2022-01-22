import { TPost, TUser } from '@mtl/types';
import cliProgress = require('cli-progress');
import { sample } from 'lodash';
import { LikeActions } from '../redis/actions/LikeActions';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const likesActions = new LikeActions();

export const generateLikes = async ({
  me,
  users,
  posts,
}: {
  me: TUser;
  users: TUser[];
  posts: TPost[];
}) => {
  const allUsers = [...users, me];

  console.log('Creating likes...');

  let currIndex = 0;
  const likesPerPost = 100;
  const numOfLikes = posts.length * likesPerPost;

  bar.start(numOfLikes, 0);

  for (const _ in Array.from({ length: numOfLikes })) {
    bar.update(currIndex + 1);

    await likesActions.createLike({
      authorId: sample(allUsers)?.id,
      postId: sample(posts)?.id,
    });

    currIndex++;
  }

  bar.stop();
};
