import { TActivity, TPost, TUser } from '@mtl/types';
import cliProgress = require('cli-progress');
import { sample } from 'lodash';
import { ActivityActions } from '../redis/actions/ActivityActions';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const ativityActions = new ActivityActions();

export const generateActivities = async ({
  me,
  users,
  posts,
}: {
  me: TUser;
  users: TUser[];
  posts: TPost[];
}) => {
  await generateLikeActivities({ me, posts, users });
  await generateCommentActivities({ me, posts, users });
  await generateFollowActivities({ me, users });
};

async function generateLikeActivities({ me, posts, users }: any) {
  console.log('Creating like activities...');

  const list: TActivity[] = [];
  let currIndex = 0;
  const likesPerPost = 10;
  const numOfLikes = posts.length * likesPerPost;

  bar.start(numOfLikes, 0);

  for (const _ in Array.from({ length: numOfLikes })) {
    bar.update(currIndex + 1);

    const activity = await ativityActions.createLikeActivity({
      authorId: sample(users)?.id,
      ownerId: me.id,
      postId: sample(posts)?.id,
    });

    list.push(activity);

    currIndex++;
  }

  bar.stop();

  return list;
}

async function generateCommentActivities({ me, posts, users }: any) {
  console.log('Creating comment activities...');

  const list: TActivity[] = [];
  let currIndex = 0;
  const likesPerPost = 10;
  const numOfLikes = posts.length * likesPerPost;

  bar.start(numOfLikes, 0);

  for (const _ in Array.from({ length: numOfLikes })) {
    bar.update(currIndex + 1);

    const activity = await ativityActions.createCommentActivity({
      authorId: sample(users)?.id,
      ownerId: me.id,
      postId: sample(posts)?.id,
    });

    list.push(activity);

    currIndex++;
  }

  bar.stop();

  return list;
}

async function generateFollowActivities({ me, users }: any) {
  console.log('Creating follow activities...');

  const list: TActivity[] = [];
  let currIndex = 0;
  const itterations = users.length;

  bar.start(itterations, 0);

  for (const _ in Array.from({ length: itterations })) {
    bar.update(currIndex + 1);

    const activity = await ativityActions.createFollowActivity({
      authorId: sample(users)?.id,
      ownerId: me.id,
    });

    list.push(activity);

    currIndex++;
  }

  bar.stop();

  return list;
}
