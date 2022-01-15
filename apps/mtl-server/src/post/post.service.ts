import * as Prisma from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { userFragment } from '../fragments/userFragment';
import { likeFragment } from '../fragments/likeFragment';
import { commentFragment } from '../fragments/commentFragment';
import { tagsFragment } from '../fragments/tagsFragment';
import { preparePost } from '../utils/preparePosts';
import { TPost } from '@mtl/types';
import { Repository } from 'redis-om';
import { postRepository, postSchema } from '../redis/entities/post';
import { redisClient, redisConnect } from '../redis/redis.client';

@Injectable()
export class PostService {
  async updatePost(
    {
      title,
      content,
      description,
      codeLanguage,
      tagId,
    }: {
      title: string;
      content: string;
      description: string;
      codeLanguage: Prisma.CodeLanguage;
      tagId: string;
    },
    postId: string
  ) {
    // const oldPost = await this.prisma.post.findFirst({
    //   where: {
    //     id: postId,
    //   },
    //   include: {
    //     tags: {
    //       select: {
    //         tagId: true,
    //       },
    //     },
    //   },
    // });

    const oldPost = await postRepository.fetch(postId);

    oldPost.title = title;
    oldPost.content = content;
    oldPost.description = description;
    oldPost.codeLanguage = codeLanguage;
    oldPost.tagIds = [tagId];
    oldPost.updatedAt = new Date();

    await postRepository.save(oldPost);

    // TODO: fix tag update
    // if (oldPost?.tags[0]?.tagId) {
    //   await this.prisma.tagsOnPosts.delete({
    //     where: {
    //       postId_tagId: {
    //         postId,
    //         tagId: oldPost?.tags?.[0]?.tagId,
    //       },
    //     },
    //   });
    // }

    // await this.prisma.tagsOnPosts.create({
    //   data: {
    //     postId,
    //     tagId,
    //   },
    // });

    // const post = await this.prisma.post.update({
    //   where: {
    //     id: postId,
    //   },
    //   data: {
    //     title,
    //     content,
    //     description,
    //     codeLanguage,
    //     updatedAt: new Date(),
    //   },
    //   include: {
    //     author: {
    //       select: userFragment,
    //     },
    //     likes: {
    //       select: likeFragment,
    //     },
    //     comments: {
    //       select: commentFragment,
    //     },
    //     tags: tagsFragment,
    //   },
    // });

    // await cache.del(redisCacheKey.createPostKey(postId));

    return oldPost;
  }

  async unpublishPost(postId: string) {
    const oldPost = await postRepository.fetch(postId);

    oldPost.published = false;
    oldPost.updatedAt = new Date();

    await postRepository.save(oldPost);
  }

  async publishPost(postId: string) {
    const oldPost = await postRepository.fetch(postId);

    oldPost.published = true;
    oldPost.updatedAt = new Date();

    await postRepository.save(oldPost);
  }

  async createPost(
    userId: string,
    {
      title,
      content,
      description,
      codeLanguage,
      tagId,
      isPublished,
    }: {
      title: string;
      content: string;
      description: string;
      codeLanguage: Prisma.CodeLanguage;
      tagId: string;
      isPublished: boolean;
    }
  ) {
    const post = await postRepository.createAndSave({
      title,
      content,
      description,
      codeLanguage,
      tagId: [tagId],
      isPublished,
    });

    return post;
  }

  async fetchPost({
    postId,
    userId,
  }: {
    postId: string;
    userId?: string;
  }): Promise<TPost | null> {
    await redisConnect();
    const post = await postRepository
      .search()
      .where('id')
      .equals(postId)
      .return.first();
    await Promise.all([
      post.addAuthor(),
      // post.addComments(),
      // post.addCommentsCount(),
      // post.addLikesCount(),
      // post.addTags(),
    ]);

    // if (!post || (!post.published && userId && post.authorId !== userId)) {
    //   return null;
    // }

    // console.log({ post });

    return post;
  }

  async findPostByCommentId(commentId: string) {
    const post = await postRepository
      .search()
      .where('commentIds')
      .contain(commentId)
      .return.first();

    return post;
  }

  async deletePost(postId: string) {
    const post = await postRepository
      .search()
      .where('id')
      .equals(postId)
      .return.first();
    postRepository.remove(post.entityId);

    // TODO: remove all post related data
    // await this.prisma.like.deleteMany({
    //   where: {
    //     postId,
    //   },
    // });

    // await this.prisma.comment.deleteMany({
    //   where: {
    //     postId,
    //   },
    // });

    // await this.prisma.tagsOnPosts.deleteMany({
    //   where: {
    //     postId,
    //   },
    // });

    // await this.prisma.post.delete({
    //   where: { id: postId },
    // });

    // await cache.del(redisCacheKey.createPostKey(postId));
  }

  async getRandomPost(): Promise<TPost> {
    const post = await postRepository.search().return.first();

    return post;
  }
}
