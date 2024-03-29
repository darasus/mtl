import { FeedType } from '@mtl/types';

export class ClientCacheKey {
  userBaseKey = ['user'];
  commentsBaseKey = ['comments'];
  doIFollowBaseKey = ['do_i_follow_user'];
  feedBaseKey = ['feed'];
  followersCountBaseKey = ['followers_count'];
  followingsCountBaseKey = ['followings_count'];
  postBaseKey = ['post'];
  screenshotBaseKey = ['post_screenshot'];
  tagsBaseKey = ['tags'];
  userActivityBaseKey = ['user_activity'];
  userPostsBaseKey = ['user_posts'];

  createUserKey({ nickname }: { nickname: string }) {
    return [...this.userBaseKey, 'tags', { nickname }];
  }

  createUserTagsKey({ nickname }: { nickname: string }) {
    return [...this.userBaseKey, { nickname }];
  }

  createPostCommentsKey({ postId }: { postId: string }) {
    return [...this.commentsBaseKey, { postId }];
  }

  createDoIFollowUserKey({ nickname }: { nickname: string }) {
    return [...this.doIFollowBaseKey, { nickname }];
  }

  createFeedKey({ feedType }: { feedType: FeedType }) {
    return [...this.feedBaseKey, { feedType }];
  }

  createFollowersCountKey({ nickname }: { nickname: string }) {
    return [...this.followersCountBaseKey, { nickname }];
  }

  createFollowingCountKey({ nickname }: { nickname: string }) {
    return [...this.followingsCountBaseKey, { nickname }];
  }

  createPostKey({ postId }: { postId: string }) {
    return [...this.postBaseKey, { postId }];
  }

  createScreenshotKey({
    postId,
    updateDate,
  }: {
    postId: string;
    updateDate: Date;
  }) {
    return [...this.screenshotBaseKey, { postId }];
  }

  createUserActivityKey({ nickname }: { nickname: string }) {
    return [...this.userActivityBaseKey, { nickname }];
  }

  createUserPostsKey({
    nickname,
    tags,
    published,
  }: {
    nickname: string;
    tags?: string[];
    published?: boolean;
  }) {
    return [...this.userPostsBaseKey, { nickname, tags, published }];
  }
}

export const clientCacheKey = new ClientCacheKey();
