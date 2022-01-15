import { TUser } from '@mtl/types';
import { Entity, Schema, Repository } from 'redis-om';
import { redisClient } from '../redis.client';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface User extends TUser {}

class User extends Entity {}

export const userSchema = new Schema(
  User,
  {
    id: { type: 'string' },
    name: { type: 'string', textSearch: true },
    image: { type: 'string' },
    nickname: { type: 'string' },
    email: { type: 'string' },
    emailVerified: { type: 'boolean' },
    password: { type: 'string' },
    postIds: { type: 'array' },
    commentIds: { type: 'array' },
    likeIds: { type: 'array' },
    followerIds: { type: 'array' },
    followingIds: { type: 'array' },
    updatedAt: { type: 'string' },
    createdAt: { type: 'string' },
  },
  {
    dataStructure: 'JSON',
  }
);

export const userRepository = new Repository(userSchema, redisClient);
