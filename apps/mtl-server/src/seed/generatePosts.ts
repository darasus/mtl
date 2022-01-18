import { TUser } from '@mtl/types';
import cliProgress = require('cli-progress');
import * as faker from 'faker';
import { PostActions } from '../redis/actions/PostActions';
import { CodeLanguage } from '.prisma/client';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const postActions = new PostActions();

export const generatePosts = async ({ me }: { me: TUser }) => {
  let currIndex = 0;

  console.log('Creating posts...');

  const numOfPosts = 100;

  bar.start(numOfPosts, 0);

  for (const _ in Array.from({ length: numOfPosts })) {
    bar.update(currIndex + 1);
    await postActions.createPost({
      userId: me.id,
      codeLanguage: CodeLanguage.JAVASCRIPT,
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      content: faker.lorem.sentence(),
      isPublished: true,
      tagIds: [],
    });
    currIndex++;
  }

  bar.stop();
};
