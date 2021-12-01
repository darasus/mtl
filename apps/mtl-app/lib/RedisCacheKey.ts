export class RedisCacheKey {
  createUserSessionKey(email: string): string {
    return `user:${email}:session`;
  }

  createUserByEmailKey(email: string): string {
    return `user:${email}`;
  }

  createUserKey(userId: string): string {
    return `user:${userId}`;
  }

  createPostKey(postId: string): string {
    return `post:${postId}`;
  }

  createUserFollowerCountKey(userId: string): string {
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

  createScreenshotKey(url: string): string {
    return `screenshot:${url}`;
  }
}

export const redisCacheKey = new RedisCacheKey();
