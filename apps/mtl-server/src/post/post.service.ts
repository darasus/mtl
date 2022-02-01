import * as Prisma from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { userFragment } from '../fragments/userFragment';
import { likeFragment } from '../fragments/likeFragment';
import { commentFragment } from '../fragments/commentFragment';
import { tagsFragment } from '../fragments/tagsFragment';
import { preparePost } from '../utils/preparePosts';
import { TPost } from '@mtl/types';
import { CacheService } from '../cache/cache.service';
import { CacheKeyService } from '../cache/cacheKey.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private cacheKeyService: CacheKeyService
  ) {}

  async updatePost({
    postId,
    title,
    content,
    description,
    codeLanguage,
    tagId,
    userId,
  }: {
    postId: string;
    title: string;
    content: string;
    description: string;
    codeLanguage: Prisma.CodeLanguage;
    tagId: string;
    userId: string;
  }): Promise<TPost> {
    const oldPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        tags: {
          select: {
            tagId: true,
          },
        },
      },
    });

    if (oldPost?.tags[0]?.tagId) {
      await this.prisma.tagsOnPosts.delete({
        where: {
          postId_tagId: {
            postId,
            tagId: oldPost?.tags?.[0]?.tagId,
          },
        },
      });
    }

    await this.prisma.tagsOnPosts.create({
      data: {
        postId,
        tagId,
      },
    });

    const post = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        description,
        codeLanguage,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: userFragment,
        },
        likes: {
          select: likeFragment,
        },
        comments: {
          select: commentFragment,
        },
        tags: tagsFragment,
      },
    });

    await this.cacheService.del(this.cacheKeyService.createPostKey({ postId }));

    return preparePost(
      {
        ...post,
        commentsCount: post.comments.length,
        comments: post.comments.slice(-5),
      },
      userId
    );
  }

  async unpublishPost(postId: string) {
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        published: false,
      },
    });

    // await cache.del(redisCacheKey.createPostKey(postId));
  }

  async publishPost(postId: string) {
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        published: true,
      },
    });

    // await cache.del(redisCacheKey.createPostKey(postId));
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
    const post = await this.prisma.post.create({
      data: {
        title,
        content,
        description,
        published: isPublished,
        codeLanguage,
        author: { connect: { id: userId } },
      },
      include: {
        author: {
          select: userFragment,
        },
        likes: {
          select: likeFragment,
        },
        comments: {
          select: commentFragment,
        },
        tags: tagsFragment,
      },
    });

    await this.prisma.tagsOnPosts.create({
      data: {
        postId: post.id,
        tagId,
      },
    });

    return preparePost({ ...post, commentsCount: 0 }, userId);
  }

  async savePost(
    {
      title,
      content,
      description,
    }: { title: string; content: string; description: string },
    userId: string
  ) {
    await this.prisma.post.create({
      data: {
        title,
        content,
        description,
        published: false,
        author: { connect: { id: userId } },
      },
      include: {
        author: {
          select: userFragment,
        },
        likes: {
          select: likeFragment,
        },
        comments: {
          select: commentFragment,
        },
        tags: tagsFragment,
      },
    });
  }

  async fetchPost({
    postId,
    userId,
  }: {
    postId: string;
    userId?: string;
  }): Promise<TPost | null> {
    // const post = await cache.fetch(
    //   redisCacheKey.createPostKey(postId),
    //   () =>
    //     prisma.post.findUnique({
    //       where: {
    //         id: postId,
    //       },
    //       include: {
    //         author: {
    //           select: userFragment,
    //         },
    //         likes: {
    //           select: likeFragment,
    //         },
    //         comments: {
    //           select: commentFragment,
    //         },
    //         tags: tagsFragment,
    //       },
    //     }),
    //   days(365)
    // );

    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: userFragment,
        },
        likes: {
          select: likeFragment,
        },
        comments: {
          select: commentFragment,
        },
        tags: tagsFragment,
      },
    });

    if (!post || (!post.published && userId && post.authorId !== userId)) {
      return null;
    }

    return preparePost(
      {
        ...post,
        commentsCount: post.comments.length,
        comments: post.comments.slice(-5),
      },
      userId
    );
  }

  async findPostByCommentId(commentId: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        comments: {
          some: {
            id: commentId,
          },
        },
      },
    });

    return post;
  }

  async deletePost(postId: string) {
    await this.prisma.like.deleteMany({
      where: {
        postId,
      },
    });

    await this.prisma.comment.deleteMany({
      where: {
        postId,
      },
    });

    await this.prisma.tagsOnPosts.deleteMany({
      where: {
        postId,
      },
    });

    await this.prisma.post.delete({
      where: { id: postId },
    });

    // await cache.del(redisCacheKey.createPostKey(postId));
  }

  async getRandomPost(): Promise<TPost> {
    const productsCount = await this.prisma.post.count();
    const skip = Math.floor(Math.random() * productsCount);
    const post = await this.prisma.post.findMany({
      take: 1,
      skip: skip,
      include: {
        author: {
          select: userFragment,
        },
        likes: {
          select: likeFragment,
        },
        comments: {
          select: commentFragment,
        },
        tags: tagsFragment,
      },
    });

    return preparePost({
      ...post[0],
      commentsCount: post[0].comments.length,
      comments: post[0].comments.slice(-5),
    });
  }
}
