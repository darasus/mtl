import { TComment } from '@mtl/types';
import { Entity, Schema, Repository } from 'redis-om';
import { redisClient } from '../redis.client';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Comment extends TComment {}

class Comment extends Entity {}

export const commentSchema = new Schema(
  Comment,
  {
    id: { type: 'string' },
    postId: { type: 'string' },
    authorId: { type: 'string' },
    content: { type: 'string' },
    updatedAt: { type: 'string' },
    createdAt: { type: 'string' },
  },
  {
    dataStructure: 'JSON',
  }
);

export const commentRepository = new Repository(commentSchema, redisClient);
