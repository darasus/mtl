import * as Prisma from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { TPost } from '@mtl/types';
import { PostActions } from '../redis/actions/PostActions';

@Injectable()
export class PostService {
  postActions = new PostActions();

  async updatePost({
    postId,
    title,
    content,
    description,
    codeLanguage,
    tagIds,
  }: {
    postId: string;
    title: string;
    content: string;
    description: string;
    codeLanguage: Prisma.CodeLanguage;
    tagIds: string[];
  }) {
    const post = await this.postActions.updatePost({
      id: postId,
      title,
      description,
      content,
      codeLanguage,
      tagIds,
    });

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

    return post;
  }

  async unpublishPost(postId: string) {
    return this.postActions.unpublishPost({ postId });
  }

  async publishPost(postId: string) {
    return this.postActions.publishPost({ postId });
  }

  async createPost({
    userId,
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
    userId: string;
  }) {
    return this.postActions.createPost({
      title,
      content,
      description,
      codeLanguage,
      tagIds: [tagId],
      isPublished,
      userId,
    });
  }

  async fetchPost({
    postId,
    userId,
  }: {
    postId: string;
    userId?: string;
  }): Promise<TPost | null> {
    // if (!post || (!post.published && userId && post.authorId !== userId)) {
    //   return null;
    // }

    return this.postActions.fetchPost({ postId });
  }

  async findPostByCommentId(commentId: string) {
    // TODO: implement this

    return null;
  }

  async deletePost(postId: string) {
    return this.postActions.deletePost({ postId });

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
}
