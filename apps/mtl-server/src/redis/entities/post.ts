import { TPost } from '@mtl/types';
import { CodeLanguage } from '@prisma/client';
import { Entity, Schema, Repository } from 'redis-om';
import { redisClient } from '../redis.client';
import { commentRepository } from './comment';
import { likeRepository } from './like';
import { tagRepository } from './tag';
import { userRepository } from './user';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Post extends TPost {}

class Post extends Entity {
  async addAuthor() {
    if (this.authorId) {
      const author = await userRepository
        .search()
        .where('id')
        .equals(this.authorId)
        .return.first();
      if (author) {
        this.author = author;
      }
    }
  }

  async addTags() {
    if (this.tagIds && this.tagIds.length) {
      const tags = await tagRepository
        .search()
        .where('id')
        .containOneOf(...this.tagIds)
        .return.all();
      this.tags = tags;
      // return tags;
    }
  }

  async addComments() {
    console.log(this.commentIds);
    if (this.commentIds && this.commentIds.length) {
      const comments = await commentRepository
        .search()
        .where('id')
        .containOneOf(...(this.commentIds || []))
        .return.all();
      this.comments = comments;
      // return comments;
    }
  }

  async addCommentsCount() {
    if (this.commentIds && this.commentIds.length) {
      const commentsCount = await commentRepository
        .search()
        .where('id')
        .containOneOf(...(this.commentIds || []))
        .return.count();
      this.commentsCount = commentsCount;
      // return commentsCount;
    }
  }

  async addLikesCount() {
    if (this.likeIds && this.likeIds.length) {
      const likesCount = await likeRepository
        .search()
        .where('id')
        .containOneOf(...(this.likeIds || []))
        .return.count();
      this.likesCount = likesCount;
      // return likesCount;
    }
  }
}

export const postSchema = new Schema(
  Post,
  {
    id: { type: 'string' },
    title: { type: 'string', textSearch: true },
    content: { type: 'string', textSearch: true },
    description: { type: 'string', textSearch: true },
    published: { type: 'boolean' },
    authorId: { type: 'string' },
    likeIds: { type: 'array' },
    commentIds: { type: 'array' },
    codeLanguage: { type: 'string' },
    tagIds: { type: 'array' },
    likesCount: { type: 'number' },
    commentsCount: { type: 'number' },
    updatedAt: { type: 'string' },
    createdAt: { type: 'string' },
  },
  {
    dataStructure: 'JSON',
  }
);

export const postRepository = new Repository(postSchema, redisClient);

// export async function createPost() {
//   await redisConnect();

//   const repository = new Repository(schema, redisClient);

//   const car = repository.createEntity({
//     title: '123',
//     content: '456',
//     description: '789',
//   });

//   const id = await repository.save(car);
//   return id;
// }

// export async function getPosts() {
//   await redisConnect();

//   const repository = new Repository(schema, redisClient);
//   // await repository.createIndex();

//   const posts = await repository.search().return.all();

//   return posts;
// }
