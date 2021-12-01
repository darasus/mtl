import prisma from "../prisma";
import cache from "../cache";
import { Post } from "../../types/Post";
import { commentFragment } from "../fragments/commentFragment";
import { likeFragment } from "../fragments/likeFragment";
import { tagsFragment } from "../fragments/tagsFragment";
import { preparePost } from "../utils/preparePost";
import { redisCacheKey } from "../RedisCacheKey";
import { days } from "../../utils/duration";
import { activityFragment } from "../fragments/activityFragment";
import { userFragment } from "../fragments/userFragment";

export class UserService {
  async getUserByEmail(email: string) {
    return cache.fetch(
      redisCacheKey.createUserByEmailKey(email),
      () =>
        prisma.user.findUnique({
          where: {
            email,
          },
          select: userFragment,
        }),
      days(365)
    );
  }

  async getUserById(userId: string) {
    return cache.fetch(
      redisCacheKey.createUserKey(userId),
      () =>
        prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: userFragment,
        }),
      days(365)
    );
  }

  async getUserPosts(userId: string, isMe: boolean): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        ...(isMe ? {} : { published: true }),
      },
      orderBy: [
        {
          id: "desc",
        },
      ],
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

    return posts.map((post) =>
      preparePost(
        {
          ...post,
          commentsCount: post.comments.length,
          comments: post.comments.slice(-5),
        },
        userId
      )
    );
  }

  async getUserActivity({
    userId,
    cursor,
    take = 10,
  }: {
    userId: string;
    cursor?: string;
    take?: number;
  }) {
    const activityCount = await prisma.activity.count({
      where: {
        ownerId: userId,
      },
    });

    const activity = await prisma.activity.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        ...activityFragment,
        follow: {
          include: {
            follower: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          id: "desc",
        },
      ],
      ...(cursor
        ? {
            cursor: {
              id: cursor,
            },
          }
        : {}),
      take,
      skip: cursor ? 1 : 0,
    });

    if (activity.length === 0) {
      return {
        items: [],
        count: 0,
        total: 0,
        cursor: 0,
      };
    }

    const lastActivityInResults = activity[activity.length - 1];
    const newCursor = lastActivityInResults.id;

    return {
      items: activity,
      count: activity.length,
      total: activityCount,
      cursor: newCursor,
    };
  }

  async updateUserSettings({
    userId,
    name,
    nickname,
    password,
    image,
    email,
  }: {
    userId: string;
    nickname: string;
    name?: string;
    password?: string;
    image?: string;
    email?: string;
  }) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(nickname ? { nickname } : {}),
        ...(name ? { name } : {}),
        ...(password ? { password } : {}),
        ...(image ? { image } : {}),
        ...(email ? { email } : {}),
      },
    });
    await cache.del(redisCacheKey.createUserKey(userId));
    await cache.del(redisCacheKey.createUserByEmailKey(user.email as string));
    await cache.del(redisCacheKey.createUserSessionKey(user.email as string));
    return user;
  }
}
