import prisma from "../prisma";
import cache from "../cache";
import { commentFragment } from "../fragments/commentFragment";
import { redisCacheKey } from "../RedisCacheKey";

export class CommentService {
  async isMyComment({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }) {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
      include: {
        author: true,
      },
    });

    return comment?.author?.id === userId;
  }

  async deleteComment(commentId: string, postId: string) {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    await cache.del(redisCacheKey.createPostKey(postId));
  }

  async getCommentsByPostId({
    postId,
    take = 5,
    skip = 0,
  }: {
    postId: string;
    take?: number;
    skip?: number;
  }) {
    const baseQuery = {
      where: {
        postId,
      },
    } as const;
    const [items, total] = await Promise.all([
      prisma.comment
        .findMany({
          ...baseQuery,
          take,
          skip,
          orderBy: { id: "desc" },
          select: commentFragment,
        })
        .then((res) => res.reverse()),
      prisma.comment.count({
        ...baseQuery,
      }),
    ]);

    return {
      items,
      count: items.length,
      total,
    };
  }

  async addComment({
    content,
    postId,
    userId,
  }: {
    content: string;
    postId: string;
    userId: string;
  }) {
    return prisma.comment
      .create({
        data: {
          content,
          post: { connect: { id: postId } },
          author: { connect: { id: userId } },
        },
      })
      .then(async (res) => {
        await cache.del(redisCacheKey.createPostKey(postId));

        return res;
      });
  }
}
