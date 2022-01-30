import { TComment, TPost, TUser } from '@mtl/types';
import cliProgress = require('cli-progress');
import * as faker from 'faker';
import { sample } from 'lodash';
import { CommentActions } from '../redis/actions/CommentActions';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const commentActions = new CommentActions();

export const generateComments = async ({
  me,
  users,
  posts,
}: {
  me: TUser;
  users: TUser[];
  posts: TPost[];
}) => {
  const allUsers = [...users, me];
  const list: TComment[] = [];

  console.log('Creating comments...');

  let currIndex = 0;
  const commentsPerPost = 100;
  const numOfComments = posts.length * commentsPerPost;

  bar.start(numOfComments, 0);

  for (const _ in Array.from({ length: numOfComments })) {
    bar.update(currIndex + 1);

    const comment = await commentActions.createComment({
      authorId: sample(allUsers)?.id as string,
      content: faker.lorem.paragraph(),
      postId: sample(posts)?.id as string,
    });

    currIndex++;

    list.push(comment);
  }

  bar.stop();

  return list;
};
