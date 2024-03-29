import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TagsOnPosts } from '@prisma/client';
import { userFragment } from '../fragments/userFragment';
import { likeFragment } from '../fragments/likeFragment';
import { commentFragment } from '../fragments/commentFragment';
import { tagsFragment } from '../fragments/tagsFragment';
import { preparePost } from '../utils/preparePosts';
import { activityFragment } from '../fragments/activityFragment';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private user({ where }: { where: Prisma.UserWhereInput }) {
    return this.prisma.user.findFirst({
      where,
      select: userFragment,
    });
  }

  getUserById({ userId }: { userId: string }) {
    return this.user({ where: { id: userId } });
  }

  async getUserByNickname({ nickname }: { nickname: string }) {
    const user = await this.user({ where: { nickname } });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUserByEmail({ email }: { email: string }) {
    const user = await this.user({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  getUserFollowerCount({ userId }: { userId: string }) {
    return this.prisma.follow.count({
      where: {
        followingId: userId,
      },
    });
  }

  getUserFollowingsCount({ userId }: { userId: string }) {
    return this.prisma.follow.count({
      where: {
        followerId: userId,
      },
    });
  }

  async getUserPosts({
    userId,
    isMe,
    cursor,
    take = 10,
    tags,
    published,
  }: {
    userId: string;
    isMe: boolean;
    cursor?: string;
    take?: number;
    tags?: string[];
    published?: boolean;
  }) {
    const postsCount = await this.prisma.post.count({
      where: {
        authorId: userId,
        ...(isMe ? {} : { published: true }),
      },
    });
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: userId,
        ...(isMe ? {} : { published: true }),
        ...(typeof published === 'boolean' ? { published } : {}),
        ...(tags && tags?.length > 0
          ? {
              tags: {
                every: {
                  tagId: {
                    in: tags,
                  },
                },
              },
            }
          : {}),
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
      take,
      skip: cursor ? 1 : 0,
      ...(cursor
        ? {
            cursor: {
              id: cursor,
            },
          }
        : {}),
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

    if (posts.length === 0) {
      return {
        items: [],
        count: 0,
        total: 0,
        cursor: null,
      };
    }

    const lastActivityInResults = posts[posts.length - 1];
    const newCursor = lastActivityInResults.id;

    return {
      count: posts.length,
      total: postsCount,
      cursor: newCursor,
      items: posts.map((post) =>
        preparePost(
          {
            ...post,
            commentsCount: post.comments.length,
            comments: post.comments.slice(-5),
          },
          userId
        )
      ),
    };
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
    const activityCount = await this.prisma.activity.count({
      where: {
        ownerId: userId,
      },
    });

    const activity = await this.prisma.activity.findMany({
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
                nickname: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          id: 'desc',
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
        cursor: null,
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

  updateUserSettings({
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
    return this.prisma.user.update({
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
  }

  async getUserTags({ nickname }: { nickname: string }) {
    const posts = await this.prisma.post.findMany({
      where: {
        author: {
          nickname,
        },
      },
      select: {
        tags: true,
      },
    });

    const tagsOnPosts = posts.reduce(
      (acc, item) => [...acc, ...item.tags],
      [] as TagsOnPosts[]
    );

    const uniqueTagIds = getUniqueListBy(tagsOnPosts, 'tagId').map(
      (t) => t.tagId
    );

    const tags = await this.prisma.tag.findMany({
      where: {
        id: {
          in: uniqueTagIds,
        },
      },
    });

    return tags;
  }

  async register({
    id,
    email,
    password: newPassword,
  }: {
    id: string;
    email: string;
    password: string;
  }) {
    const password = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.create({
      data: {
        image: 'https://www.mytinylibrary.com/user-image.png',
        email,
        nickname: email,
        id,
        name: email,
        password,
      },
    });
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('User not found');
    }

    return user;
  }

  async verifyEmail({ email }: { email: string }) {
    return this.prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });
  }

  async changePassword({
    email,
    password: newPassword,
  }: {
    email: string;
    password: string;
  }) {
    const password = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password,
      },
    });
  }
  async deleteUser({ id }: { id: string }) {
    // TODO: implement
  }
}

function getUniqueListBy<T>(arr: Array<T>, key: keyof T) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}
