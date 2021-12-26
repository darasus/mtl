import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheKeyService {
  createUserSessionKey({ email }: { email: string }): string {
    return `user:${email}:session`;
  }

  createUserByEmailKey({ email }: { email: string }): string {
    return `user:${email}`;
  }

  createUserKey({ userId }: { userId: string }): string {
    return `user:${userId}`;
  }

  createPostKey({ postId }: { postId: string }): string {
    return `post:${postId}`;
  }

  createUserFollowerCountKey({ userId }: { userId: string }): string {
    return `user:${userId}:follower_count`;
  }

  createDoIFollowKey({
    followingUserId,
    followerUserId,
  }: {
    followingUserId: string;
    followerUserId: string;
  }): string {
    return `follow:${followingUserId}:${followerUserId}`;
  }

  createTagsKey(): string {
    return `tags`;
  }

  createScreenshotKey({
    id,
    updateDate,
  }: {
    id: string;
    updateDate: string;
  }): string {
    return `screenshot:${id}:${updateDate}`;
  }
}
