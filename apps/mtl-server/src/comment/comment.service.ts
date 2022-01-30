import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { commentFragment } from '../fragments/commentFragment';
import { PusherService } from '../pusher/pusher.service';
import { CommentActions } from '../redis/actions/CommentActions';

@Injectable()
export class CommentService {
  commentActions = new CommentActions();

  constructor(private pusherService: PusherService) {}

  async isMyComment({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }) {
    // const comment = await commentRepository
    //   .search()
    //   .where('id')
    //   .equals(commentId)
    //   .return.first();

    // return comment?.author?.id === userId;

    return true;
  }

  async deleteComment({
    commentId,
    ownerId,
  }: {
    commentId: string;
    postId: string;
    ownerId: string;
  }) {
    await this.commentActions.deleteComment({
      commentId,
    });

    await this.pusherService.pusher.trigger(
      `activity-user-${ownerId}`,
      'activity-removed',
      {
        data: null,
      }
    );
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
    // const baseQuery = {
    //   where: {
    //     postId,
    //   },
    // } as const;
    // const [items, total] = await Promise.all([
    //   this.prisma.comment
    //     .findMany({
    //       ...baseQuery,
    //       take,
    //       skip,
    //       orderBy: { id: 'desc' },
    //       select: commentFragment,
    //     })
    //     .then((res) => res.reverse()),
    //   this.prisma.comment.count({
    //     ...baseQuery,
    //   }),
    // ]);

    return {
      items: [],
      count: 0,
      total: 0,
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
    return this.commentActions.createComment({
      content,
      postId,
      authorId: userId,
    });
  }
}
