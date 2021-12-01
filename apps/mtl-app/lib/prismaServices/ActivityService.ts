import prisma from "../prisma";
import { activityFragment } from "../fragments/activityFragment";
import { pusher } from "../pusher";

export class ActivityService {
  // like

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

    const activity = await prisma.activity.create({
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

    await pusher.trigger(`activity-user-${ownerId}`, "activity-added", {
      data: activity,
    });

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
    const like = await prisma.like.findFirst({
      where: {
        postId,
        authorId,
      },
    });

    if (!like?.id) return;

    const activity = await prisma.activity.findFirst({
      where: {
        likeId: like.id,
      },
    });

    if (!activity?.id) return;

    await prisma.activity.delete({
      where: {
        id: activity.id,
      },
    });

    await pusher.trigger(`activity-user-${ownerId}`, "activity-removed", {
      data: null,
    });
  }

  // comment

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

    const activity = await prisma.activity.create({
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

    await pusher.trigger(`activity-user-${ownerId}`, "activity-added", {
      data: activity,
    });

    return activity;
  }

  async removeCommentActivity({
    commentId,
    ownerId,
  }: {
    commentId: string;
    ownerId: string;
  }) {
    const activity = await prisma.activity.findFirst({
      where: {
        commentId,
      },
    });

    if (!activity?.id) return;

    await prisma.activity.delete({
      where: {
        id: activity.id,
      },
    });

    await pusher.trigger(`activity-user-${ownerId}`, "activity-removed", {
      data: null,
    });
  }

  async markActivityAsRead({ activityId }: { activityId: string }) {
    return prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        unread: false,
      },
    });
  }

  async markAllActivityAsRead({ userId }: { userId: string }) {
    const allUnreeadActivities = await prisma.activity.findMany({
      where: {
        ownerId: userId,
        unread: true,
      },
    });

    return prisma.activity.updateMany({
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

    const activity = await prisma.activity.create({
      data: {
        followFollowerId,
        followFollowingId,
        authorId,
        ownerId,
      },
    });

    await pusher.trigger(`activity-user-${ownerId}`, "activity-added", {
      data: null,
    });

    return activity;
  }

  async removeFollowActivity({
    followFollowerId,
    followFollowingId,
  }: {
    followFollowerId: string;
    followFollowingId: string;
  }) {
    const activity = await prisma.activity.findFirst({
      where: {
        followFollowerId,
        followFollowingId,
      },
    });

    if (!activity?.id) return;

    await prisma.activity.delete({
      where: {
        id: activity.id,
      },
    });

    await pusher.trigger(
      `activity-user-${followFollowingId}`,
      "activity-removed",
      {
        data: null,
      }
    );
  }
}
