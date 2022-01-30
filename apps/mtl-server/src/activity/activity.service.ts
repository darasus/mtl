import { TActivity } from '@mtl/types';
import { Injectable } from '@nestjs/common';
import { activityFragment } from '../fragments/activityFragment';
import { PusherService } from '../pusher/pusher.service';
import { ActivityActions } from '../redis/actions/ActivityActions';

@Injectable()
export class ActivityService {
  constructor(
    private pusherService: PusherService,
    private activityActions: ActivityActions
  ) {}

  async addLikeActivity({
    authorId,
    ownerId,
    postId,
  }: {
    authorId: string;
    ownerId: string;
    postId: string;
  }): Promise<TActivity> {
    if (authorId === ownerId) return null;

    const activity = await this.activityActions.createLikeActivity({
      authorId,
      ownerId,
      postId,
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
  }): Promise<void> {
    await this.activityActions.removeLikeActivity({
      postId,
      authorId,
      ownerId,
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
  }): Promise<TActivity | void> {
    if (authorId === ownerId) return;

    const activity = await this.activityActions.createCommentActivity({
      authorId,
      ownerId,
      commentId,
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
