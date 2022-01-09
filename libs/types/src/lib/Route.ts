export enum Route {
  // user
  UserPosts = 'user/:nickname/posts',
  UserTags = 'user/:nickname/tags',
  User = 'user/:nickname',
  UserActivity = 'user/:nickname/activity',
  UserFollowCount = 'user/:nickname/follow/count',
  UserFollowingsCount = 'user/:nickname/followings/count',
  DoIFillowUser = 'user/:nickname/follow',
  // post
  PostComments = 'post/:postId/comments',
  Post = 'post/:postId',
  RandomPost = 'post/random',
  // feed
  Feed = 'feed',
  // screenshot
  PostScreenshot = 'screenshot',
  // tags
  Tags = 'tags',
}
