import { TPost, TTag, TUser } from '@mtl/types';
import cliProgress = require('cli-progress');
import * as faker from 'faker';
import { PostActions } from '../redis/actions/PostActions';
import { CodeLanguage } from '.prisma/client';
import { sample } from 'lodash';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const postActions = new PostActions();

export const generatePosts = async ({
  me,
  tags,
}: {
  me: TUser;
  tags: TTag[];
}) => {
  const list: TPost[] = [];
  let currIndex = 0;

  console.log('Creating posts...');

  const numOfPosts = 10;

  bar.start(numOfPosts, 0);

  for (const _ in Array.from({ length: numOfPosts })) {
    bar.update(currIndex + 1);
    const post = await postActions.createPost({
      userId: me.id,
      codeLanguage: CodeLanguage.JAVASCRIPT,
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      content: faker.lorem.sentence(),
      isPublished: true,
      tagIds: [sample(tags)?.id as string],
    });

    currIndex++;

    if (post) {
      list.push(post);
    }
  }

  bar.stop();

  return list;
};
