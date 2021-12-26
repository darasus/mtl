import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheKeyService {
  createUserByEmailKey({ email }: { email: string }): string {
    return `user:${email}`;
  }

  createUserKey({ nickname }: { nickname: string }): string {
    return `user:${nickname}`;
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
