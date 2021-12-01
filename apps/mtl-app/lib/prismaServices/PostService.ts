import prisma from "../prisma";
import { Post } from "../../types/Post";
import { CodeLanguage } from ".prisma/client";
import { likeFragment } from "../fragments/likeFragment";
import { commentFragment } from "../fragments/commentFragment";
import { preparePost } from "../utils/preparePost";
import cache from "../cache";
import { tagsFragment } from "../fragments/tagsFragment";
import { days } from "../../utils/duration";
import { redisCacheKey } from "../RedisCacheKey";
import { userFragment } from "../fragments/userFragment";

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
      codeLanguage: CodeLanguage;
      tagId: string;
    },
    postId: string
  ) {
    const oldPost = await prisma.post.findFirst({
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
      await prisma.tagsOnPosts.delete({
        where: {
          postId_tagId: {
            postId,
            tagId: oldPost?.tags?.[0]?.tagId,
          },
        },
      });
    }

    await prisma.tagsOnPosts.create({
      data: {
        postId,
        tagId,
      },
    });

    const post = await prisma.post.update({
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

    await cache.del(redisCacheKey.createPostKey(postId));

    return post;
  }

  async unpublishPost(postId: string) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        published: false,
      },
    });

    await cache.del(redisCacheKey.createPostKey(postId));
  }

  async publishPost(postId: string) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        published: true,
      },
    });

    await cache.del(redisCacheKey.createPostKey(postId));
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
      codeLanguage: CodeLanguage;
      tagId: string;
      isPublished: boolean;
    }
  ) {
    const post = await prisma.post.create({
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

    await prisma.tagsOnPosts.create({
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
    await prisma.post.create({
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

  async fetchPost(postId: string, userId?: string): Promise<Post | null> {
    const post = await cache.fetch(
      redisCacheKey.createPostKey(postId),
      () =>
        prisma.post.findUnique({
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
        }),
      days(365)
    );

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
    const post = await prisma.post.findFirst({
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
    await prisma.like.deleteMany({
      where: {
        postId,
      },
    });

    await prisma.comment.deleteMany({
      where: {
        postId,
      },
    });

    await prisma.tagsOnPosts.deleteMany({
      where: {
        postId,
      },
    });

    await prisma.post.delete({
      where: { id: postId },
    });

    await cache.del(redisCacheKey.createPostKey(postId));
  }
}
