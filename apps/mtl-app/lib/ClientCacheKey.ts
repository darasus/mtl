import { FeedType } from "../types/FeedType";

export class ClientCacheKey {
  userBaseKey = ["user"];
  commentsBaseKey = ["comments"];
  doIFollowBaseKey = ["do_i_follow_user"];
  feedBaseKey = ["feed"];
  followersCountBaseKey = ["followers_count"];
  postBaseKey = ["post"];
  screenshotBaseKey = ["post"];
  tagsBaseKey = ["tags"];
  userActivityBaseKey = ["user_activity"];
  userPostsBaseKey = ["user-posts"];

  createUserKey(userId: string) {
    return [...this.userBaseKey, { userId }];
  }

  createPostCommentsKey(postId: string) {
    return [...this.commentsBaseKey, { postId }];
  }

  createDoIFollowUserKey(userId: string) {
    return [...this.doIFollowBaseKey, { userId }];
  }

  createFeedKey(feedType: FeedType) {
    return [...this.feedBaseKey, { feedType }];
  }

  createFollowersCountKey(userId: string) {
    return [...this.followersCountBaseKey, { userId }];
  }

  createPostKey(postId: string) {
    return [...this.postBaseKey, { postId }];
  }

  createScreenshotKey(url: string) {
    return [...this.screenshotBaseKey, { url }];
  }

  createUserActivityKey(userId: string) {
    return [...this.userActivityBaseKey, { userId }];
  }

  createUserPostsKey(userId: string) {
    return [...this.userPostsBaseKey, { userId }];
  }
}

export const clientCacheKey = new ClientCacheKey();
