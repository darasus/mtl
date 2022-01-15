import { Entity, Schema, Repository } from 'redis-om';
import { TLike } from '@mtl/types';
import { redisClient } from '../redis.client';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Like extends TLike {}

class Like extends Entity {}

export const likeSchema = new Schema(Like, {
  id: { type: 'string' },
  postId: { type: 'string' },
  authorId: { type: 'string' },
  updatedAt: { type: 'string' },
  createdAt: { type: 'string' },
});

export const likeRepository = new Repository(likeSchema, redisClient);
