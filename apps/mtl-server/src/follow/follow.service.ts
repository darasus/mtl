import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async getNumberOfFollowers(userId: string) {
    return this.prisma.follow.count({
      where: {
        followingId: userId,
      },
    });
  }

  async followUser({
    followingUserId,
    followerUserId,
  }: {
    followingUserId: string;
    followerUserId: string;
  }) {
    return this.prisma.follow.create({
      data: {
        follower: {
          connect: {
            id: followerUserId,
          },
        },
        following: {
          connect: {
            id: followingUserId,
          },
        },
      },
    });
  }

  async unfollowUser({
    followingUserId,
    followerUserId,
  }: {
    followingUserId: string;
    followerUserId: string;
  }) {
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: followerUserId,
          followingId: followingUserId,
        },
      },
    });
  }

  async doIFollow({
    followingUserId,
    followerUserId,
  }: {
    followingUserId: string;
    followerUserId: string;
  }) {
    const response = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerUserId,
          followingId: followingUserId,
        },
      },
    });

    return { doIFollow: !!response };
  }
}
