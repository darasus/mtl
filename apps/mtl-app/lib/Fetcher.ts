import { CodeLanguage } from ".prisma/client";
import { CommentService } from "./prismaServices/CommentService";
import { Post } from "../types/Post";
import { User } from "../types/User";
import qs from "query-string";
import { FeedService } from "./prismaServices/FeedService";
import { FollowService } from "./prismaServices/FollowService";
import { PostService } from "./prismaServices/PostService";
import { TagService } from "./prismaServices/TagService";
import { LikeService } from "./prismaServices/LikeService";
import { ServerHttpConnector } from "./ServerHttpConnector";
import { ClientHttpConnector } from "./ClientHttpConnector";
import { FeedType } from "../types/FeedType";
import { UserService } from "./prismaServices/UserService";
import { ActivityService } from "./prismaServices/ActivityService";
import ServerFormData from "form-data";

export class Fetcher {
  httpConnector: ServerHttpConnector | ClientHttpConnector;

  constructor(httpConnector: ServerHttpConnector | ClientHttpConnector) {
    this.httpConnector = httpConnector;
  }

  // auth

  refetchAuthUserProfile = (): Promise<void> =>
    this.httpConnector.request.get("/api/auth/refetch");

  // user

  getMe = (): Promise<User> =>
    this.httpConnector.request("/api/me").then((res) => res.data);

  getUser = (userId: string): Promise<User> =>
    this.httpConnector.request(`/api/user/${userId}`).then((res) => res.data);

  getUserPosts = (userId: string): Promise<Post[]> =>
    this.httpConnector
      .request(`/api/user/${userId}/posts`)
      .then((res) => res.data);

  invalidateUser = (userId: string): Promise<{ status: "success" }> =>
    this.httpConnector
      .request(`/api/user/${userId}/invalidate`, {
        method: "POST",
        data: {},
      })
      .then((res) => res.data);

  updateUserSettings = ({
    userId,
    ...data
  }: {
    userId: string;
    nickname?: string;
    name?: string;
    password?: string;
    image?: string;
    email?: string;
  }) =>
    this.httpConnector.post(`/api/user/${userId}/update-settings`, { ...data });

  // like

  likePost = (postId: string): ReturnType<LikeService["likePost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/like`, {
        method: "POST",
      })
      .then((res) => res.data);

  unlikePost = (postId: string): ReturnType<LikeService["unlikePost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/unlike`, {
        method: "POST",
      })
      .then((res) => res.data);

  // comments

  getComments = ({
    postId,
    take,
    skip,
  }: {
    postId: string;
    take?: number;
    skip?: number;
  }): ReturnType<CommentService["getCommentsByPostId"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/comments?${qs.stringify({ take, skip })}`)
      .then((res) => res.data);

  addComment = (
    postId: string,
    content: string
  ): ReturnType<CommentService["addComment"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/addComment`, {
        method: "POST",
        data: {
          content,
        },
      })
      .then((res) => res.data);

  deleteComment = (
    commentId: string
  ): ReturnType<CommentService["deleteComment"]> =>
    this.httpConnector
      .request(`/api/comment/${commentId}`, {
        method: "DELETE",
      })
      .then((res) => res.data);

  // follow

  doIFollowUser = (userId: string): ReturnType<FollowService["doIFollow"]> =>
    this.httpConnector
      .request(`/api/user/${userId}/follow`)
      .then((res) => res.data);

  getFollowersCount = (
    userId: string
  ): ReturnType<FollowService["getNumberOfFollowers"]> =>
    this.httpConnector
      .request(`/api/user/${userId}/follow/count`)
      .then((res) => res.data);

  followUser = (userId: string): ReturnType<FollowService["followUser"]> =>
    this.httpConnector
      .request(`/api/user/${userId}/follow`, {
        method: "POST",
      })
      .then((res) => res.data);

  unfollowUser = (userId: string): ReturnType<FollowService["unfollowUser"]> =>
    this.httpConnector
      .request(`/api/user/${userId}/unfollow`, {
        method: "POST",
      })
      .then((res) => res.data);

  // feed

  getFeed = ({
    cursor,
    feedType,
  }: {
    cursor?: string;
    feedType: FeedType;
  }): ReturnType<FeedService["fetchLatestFeed"]> =>
    this.httpConnector
      .request(`/api/feed?${qs.stringify({ cursor, feedType })}`)
      .then((res) => res.data);

  // post

  getPost = (postId: string): Promise<Post> =>
    this.httpConnector.request(`/api/post/${postId}`).then((res) => res.data);

  getScreenshot = ({
    url,
    width,
    height,
  }: {
    url: string;
    width?: number;
    height?: number;
  }): Promise<Blob> => {
    return this.httpConnector
      .request(`/api/screenshot?${qs.stringify({ url, width, height })}`, {
        responseType: "blob",
      })
      .then((res) => res.data);
  };

  createPost = (data: {
    title: string;
    description: string;
    content: string;
    codeLanguage: CodeLanguage;
    tagId: string;
  }): ReturnType<PostService["createPost"]> =>
    this.httpConnector
      .request(`/api/post/create`, {
        method: "POST",
        data,
      })
      .then((res) => res.data);

  deletePost = (postId: string): ReturnType<PostService["deletePost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/delete`, {
        method: "DELETE",
      })
      .then((res) => res.data);

  updatePost = (
    postId: string,
    data: {
      title: string;
      description: string;
      content: string;
      codeLanguage: CodeLanguage;
      tagId: string;
    }
  ): ReturnType<PostService["updatePost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/update`, {
        method: "PUT",
        data,
      })
      .then((res) => res.data);

  publishPost = (postId: string): ReturnType<PostService["publishPost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/publish`, {
        method: "PUT",
      })
      .then((res) => res.data);

  unpublishPost = (postId: string): ReturnType<PostService["unpublishPost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/unpublish`, {
        method: "PUT",
      })
      .then((res) => res.data);

  // tags

  getAllTags = (): ReturnType<TagService["getAllTags"]> => {
    return this.httpConnector.request(`/api/tags`).then((res) => res.data);
  };

  // activity

  getUserActivity = ({
    userId,
    cursor,
  }: {
    userId: string;
    cursor: string;
  }): ReturnType<UserService["getUserActivity"]> => {
    return this.httpConnector
      .request(`/api/user/${userId}/activity?${qs.stringify({ cursor })}`)
      .then((res) => res.data);
  };

  markActivityAsRead = (
    activityId: string
  ): ReturnType<ActivityService["markActivityAsRead"]> => {
    return this.httpConnector
      .request(`/api/activity/${activityId}/markAsRead`, { method: "POST" })
      .then((res) => res.data);
  };

  markAllActivityAsRead = (): ReturnType<
    ActivityService["markAllActivityAsRead"]
  > => {
    return this.httpConnector
      .request(`/api/activity/markAllAsRead`, { method: "POST" })
      .then((res) => res.data);
  };

  // image upload

  uploadImage = (data: FormData): Promise<{ imageUrl: string | null }> =>
    this.httpConnector
      .request(`/api/upload-image`, { method: "POST", data })
      .then((res) => res.data);

  uploadImageToCloudFlare = (
    data: ServerFormData,
    headers: Record<string, string>
  ): Promise<{ imageUrl: string | null }> =>
    this.httpConnector
      .request(
        `client/v4/accounts/520ed574991657981b4927dda46f2477/images/v1`,
        {
          method: "POST",
          baseURL: "https://api.cloudflare.com",
          data,
          headers: {
            ...headers,
            Authorization: `Bearer vXd5f9tLFMrLYduwqFg0_owwaVGcfdcL8iZErPBY`,
          },
        }
      )
      .then((res) => ({ imageUrl: res.data?.result?.variants?.[0] || null }));
}
