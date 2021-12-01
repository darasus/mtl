import prisma from "../prisma";
import cache from "../cache";
import { days } from "../../utils/duration";
import { redisCacheKey } from "../RedisCacheKey";

export class TagService {
  async getAllTags() {
    return cache.fetch(
      redisCacheKey.createTagsKey(),
      () =>
        prisma.tag.findMany({
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
      days(365)
    );
  }
}
