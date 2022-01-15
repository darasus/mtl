import { TTag } from '@mtl/types';
import { Entity, Schema, Repository } from 'redis-om';
import { redisClient } from '../redis.client';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Tag extends TTag {}

class Tag extends Entity {}

export const tagSchema = new Schema(Tag, {
  id: { type: 'string' },
  name: { type: 'string' },
  updatedAt: { type: 'string' },
  createdAt: { type: 'string' },
});

export const tagRepository = new Repository(tagSchema, redisClient);
