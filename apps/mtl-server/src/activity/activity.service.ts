import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { activityFragment } from '../fragments/activityFragment';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class ActivityService {
  constructor(
    private prisma: PrismaService,
    private pusherService: PusherService
  ) {}

  async addLikeActivity({
    authorId,
    likeId,
    ownerId,
    postId,
  }: {
    authorId: string;
    likeId: string;
    ownerId: string;
    postId: string;
  }) {
    if (authorId === ownerId) return null;

    const activity = await this.prisma.activity.create({
      data: {
        authorId,
        likeId,
        ownerId,
        postId,
      },
      include: {
        ...activityFragment,
      },
    });

    await this.pusherService.pusher.trigger(
      `activity-user-${ownerId}`,
      'activity-added',
      {
        data: activity,
      }
    );

    return activity;
  }

  async removeLikeActivity({
    postId,
    authorId,
    ownerId,
  }: {
    postId: string;
    authorId: string;
    ownerId: string;
  }) {
    const like = await this.prisma.like.findFirst({
      where: {
        postId,
        authorId,
      },
    });

    if (!like?.id) return;

    const activity = await this.prisma.activity.findFirst({
      where: {
        likeId: like.id,
      },
    });

    if (!activity?.id) return;

    await this.prisma.activity.delete({
      where: {
        id: activity.id,
      },
    });

    await this.pusherService.pusher.trigger(
      `activity-user-${ownerId}`,
      'activity-removed',
      {
        data: null,
      }
    );
  }

  async addCommentActivity({
    authorId,
    commentId,
    ownerId,
    postId,
  }: {
    authorId: string;
    commentId: string;
    ownerId: string;
    postId: string;
  }) {
    if (authorId === ownerId) return null;

    const activity = await this.prisma.activity.create({
      data: {
        authorId,
        commentId,
        ownerId,
        postId,
      },
      include: {
        ...activityFragment,
      },
    });

    await this.pusherService.pusher.trigger(
      `activity-user-${ownerId}`,
      'activity-added',
      {
        data: activity,
      }
    );

    return activity;
  }

  async removeCommentActivity({
    commentId,
    ownerId,
  }: {
    commentId: string;
    ownerId: string;
  }) {
    const activity = await this.prisma.activity.findFirst({
      where: {
        commentId,
      },
    });

    if (!activity?.id) return;

    await this.prisma.activity.delete({
      where: {
        id: activity.id,
      },
    });

    await this.pusherService.pusher.trigger(
      `activity-user-${ownerId}`,
      'activity-removed',
      {
        data: null,
      }
    );
  }

  async markActivityAsRead({ activityId }: { activityId: string }) {
    return this.prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        unread: false,
      },
    });
  }

  async markAllActivityAsRead({ userId }: { userId: string }) {
    const allUnreeadActivities = await this.prisma.activity.findMany({
      where: {
        ownerId: userId,
        unread: true,
      },
    });

    return this.prisma.activity.updateMany({
      where: {
        id: {
          in: allUnreeadActivities.map((activity) => activity.id),
        },
      },
      data: {
        unread: false,
      },
    });
  }

  async addFollowActivity({
    followFollowerId,
    followFollowingId,
    authorId,
    ownerId,
  }: {
    followFollowerId: string;
    followFollowingId: string;
    authorId: string;
    ownerId: string;
  }) {
    if (authorId === ownerId) return null;

    const activity = await this.prisma.activity.create({
      data: {
        followFollowerId,
        followFollowingId,
        authorId,
        ownerId,
      },
    });

    await this.pusherService.pusher.trigger(
      `activity-user-${ownerId}`,
      'activity-added',
      {
        data: null,
      }
    );

    return activity;
  }

  async removeFollowActivity({
    followFollowerId,
    followFollowingId,
  }: {
    followFollowerId: string;
    followFollowingId: string;
  }) {
    const activity = await this.prisma.activity.findFirst({
      where: {
        followFollowerId,
        followFollowingId,
      },
    });

    if (!activity?.id) return;

    await this.prisma.activity.delete({
      where: {
        id: activity.id,
      },
    });

    await this.pusherService.pusher.trigger(
      `activity-user-${followFollowingId}`,
      'activity-removed',
      {
        data: null,
      }
    );
  }
}
