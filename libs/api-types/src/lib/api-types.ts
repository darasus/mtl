import {
  ApiPage,
  TPost,
  Route,
  TUser,
  TComment,
  NonCursorApiPages,
  TTag,
  TActivity,
} from '@mtl/types';

export type ApiResponse = {
  [Route.UserPosts]: ApiPage<TPost>;
  [Route.UserTags]: TTag[];
  [Route.Feed]: ApiPage<TPost>;
  [Route.PostComments]: NonCursorApiPages<TComment>;
  [Route.Post]: TPost;
  [Route.RandomPost]: TPost;
  [Route.PostScreenshot]: any;
  [Route.Tags]: TTag[];
  [Route.User]: TUser;
  [Route.UserActivity]: ApiPage<TActivity>;
  [Route.UserFollowCount]: number;
  [Route.UserFollowingsCount]: number;
  [Route.DoIFillowUser]: {
    doIFollow: boolean;
  };
};
