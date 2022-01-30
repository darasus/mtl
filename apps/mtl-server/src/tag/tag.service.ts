import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TagActions } from '../redis/actions/TagActions';

@Injectable()
export class TagService {
  tagActions = new TagActions();

  constructor(private prisma: PrismaService) {}

  async getAllTags() {
    // return cache.fetch(
    //   redisCacheKey.createTagsKey(),
    //   () =>
    //     prisma.tag.findMany({
    //       select: {
    //         id: true,
    //         name: true,
    //         createdAt: true,
    //         updatedAt: true,
    //       },
    //     }),
    //   days(365)
    // );

    // return this.prisma.tag.findMany({
    //   select: {
    //     id: true,
    //     name: true,
    //     createdAt: true,
    //     updatedAt: true,
    //   },
    // });

    return this.tagActions.getAllTags();
  }
}
