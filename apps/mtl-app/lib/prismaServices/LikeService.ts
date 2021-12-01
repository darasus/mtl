import prisma from "../prisma";

export class LikeService {
  async likePost(postId: string, userId: string) {
    return prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        author: { connect: { id: userId } },
      },
    });
  }

  async unlikePost(postId: string, userId: string) {
    const like = await prisma.like.findFirst({
      where: {
        postId,
        author: {
          id: userId,
        },
      },
    });

    await prisma.like.delete({
      where: {
        id: like?.id,
      },
    });
  }
}
