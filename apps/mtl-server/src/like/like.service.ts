import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async likePost(postId: string, userId: string) {
    return this.prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        author: { connect: { id: userId } },
      },
    });
  }

  async unlikePost(postId: string, userId: string) {
    const like = await this.prisma.like.findFirst({
      where: {
        postId,
        author: {
          id: userId,
        },
      },
    });

    await this.prisma.like.delete({
      where: {
        id: like?.id,
      },
    });
  }
}
