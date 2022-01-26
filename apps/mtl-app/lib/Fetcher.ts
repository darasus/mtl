import { CodeLanguage } from '.prisma/client';
import qs from 'query-string';
import { HttpConnector } from './HttpConnector';
import ServerFormData from 'form-data';
import { ApiResponse } from '@mtl/api-types';
import { ApiPage, ApiPages, FeedType, Route, TComment } from '@mtl/types';
import { createApiRoute } from '@mtl/api-utils';
import { rejectNil } from '@mtl/utils';

export class Fetcher {
  httpConnector: HttpConnector;

  constructor(httpConnector: HttpConnector) {
    this.httpConnector = httpConnector;
  }

  // auth

  refetchAuthUserProfile = (): Promise<any> =>
    this.httpConnector.get(`${window.location.origin}/api/auth/refetch`);

  // user

  getUser = ({
    nickname,
  }: {
    nickname: string;
  }): Promise<ApiResponse[Route.User]> =>
    this.httpConnector
      .get(createApiRoute({ route: Route.User, variable: { nickname } }))
      .then((res) => res.data);

  getUserPosts = ({
    nickname,
    cursor,
    tags = [],
    published,
  }: {
    nickname: string;
    cursor?: string;
    tags?: string[];
    published?: boolean;
  }): Promise<ApiResponse[Route.UserPosts]> => {
    const query = qs.stringify(
      rejectNil({
        cursor,
        tags: tags?.length > 0 ? tags?.join(',') : null,
        published,
      })
    );
    return this.httpConnector
      .get(
        createApiRoute({
          route: Route.UserPosts,
          variable: { nickname },
          query,
        })
      )
      .then((res) => res.data);
  };

  invalidateUser = ({
    nickname,
  }: {
    nickname: string;
  }): Promise<{ status: 'success' }> =>
    this.httpConnector
      .post(`/api/user/${nickname}/invalidate`, {})
      .then((res) => res.data);

  updateUserSettings = ({
    currentNickname,
    ...data
  }: {
    currentNickname: string;
    newNickname?: string;
    name?: string;
    password?: string;
    image?: string;
    email?: string;
  }) =>
    this.httpConnector.post(`/api/user/${currentNickname}/update`, { ...data });

  fetchUserTags = ({
    nickname,
  }: {
    nickname: string;
  }): Promise<ApiResponse[Route.UserTags]> =>
    this.httpConnector
      .get(createApiRoute({ route: Route.UserTags, variable: { nickname } }))
      .then((res) => res.data);

  // like

  likePost = ({ postId }: { postId: string }) =>
    this.httpConnector
      .post(`/api/post/${postId}/like`, {})
      .then((res) => res.data);

  unlikePost = ({ postId }: { postId: string }) =>
    this.httpConnector
      .post(`/api/post/${postId}/unlike`, {})
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
  }): Promise<ApiPage<TComment>> =>
    this.httpConnector
      .get(`/api/post/${postId}/comments?${qs.stringify({ take, skip })}`)
      .then((res) => res.data);

  addComment = ({ postId, content }: { postId: string; content: string }) =>
    this.httpConnector
      .post(`/api/post/${postId}/addComment`, {
        content,
      })
      .then((res) => res.data);

  deleteComment = ({ commentId }: { commentId: string }) =>
    this.httpConnector
      .delete(`/api/comment/${commentId}`)
      .then((res) => res.data);

  // follow

  doIFollowUser = ({
    nickname,
  }: {
    nickname: string;
  }): Promise<ApiResponse[Route.DoIFillowUser]> =>
    this.httpConnector
      .get(
        createApiRoute({ route: Route.DoIFillowUser, variable: { nickname } })
      )
      .then((res) => res.data);

  getFollowersCount = ({
    nickname,
  }: {
    nickname: string;
  }): Promise<ApiResponse[Route.UserFollowCount]> =>
    this.httpConnector
      .get(
        createApiRoute({ route: Route.UserFollowCount, variable: { nickname } })
      )
      .then((res) => res.data);

  getFollowingsCount = ({
    nickname,
  }: {
    nickname: string;
  }): Promise<ApiResponse[Route.UserFollowingsCount]> =>
    this.httpConnector
      .get(
        createApiRoute({
          route: Route.UserFollowingsCount,
          variable: { nickname },
        })
      )
      .then((res) => res.data);

  followUser = ({ nickname }: { nickname: string }) =>
    this.httpConnector
      .post(`/api/user/${nickname}/follow`, {})
      .then((res) => res.data);

  unfollowUser = ({ nickname }: { nickname: string }) =>
    this.httpConnector
      .post(`/api/user/${nickname}/unfollow`, {})
      .then((res) => res.data);

  // feed

  getFeed = ({
    cursor,
    feedType,
  }: {
    cursor?: string;
    feedType: FeedType;
  }): Promise<ApiResponse[Route.Feed]> =>
    this.httpConnector
      .get(
        createApiRoute({
          route: Route.Feed,
          query: qs.stringify({
            cursor,
            feedType,
          }),
        })
      )
      .then((res) => res.data);

  // post

  getPost = ({
    postId,
  }: {
    postId: string;
  }): Promise<ApiResponse[Route.Post]> =>
    this.httpConnector
      .get(createApiRoute({ route: Route.Post, variable: { postId } }))
      .then((res) => res.data);

  getScreenshot = ({
    postId,
    width,
    height,
    updateDate,
  }: {
    postId: string;
    width?: number;
    height?: number;
    updateDate: Date;
  }): Promise<Blob> => {
    return this.httpConnector
      .request(
        `/api/screenshot?${qs.stringify({
          id: postId,
          width,
          height,
          updateDate,
        })}`,
        {
          responseType: 'blob',
        }
      )
      .then((res) => res.data);
  };

  createPost = (data: {
    title: string;
    description: string;
    content: string;
    codeLanguage: CodeLanguage;
    tagId: string;
  }) =>
    this.httpConnector.post(`/api/post/create`, data).then((res) => res.data);

  deletePost = (postId: string) =>
    this.httpConnector.delete(`/api/post/${postId}`).then((res) => res.data);

  updatePost = (
    postId: string,
    data: {
      title: string;
      description: string;
      content: string;
      codeLanguage: CodeLanguage;
      tagId: string;
    }
  ) =>
    this.httpConnector
      .put(`/api/post/${postId}/update`, data)
      .then((res) => res.data);

  publishPost = ({ postId }: { postId: string }) =>
    this.httpConnector
      .put(`/api/post/${postId}/publish`, {})
      .then((res) => res.data);

  unpublishPost = ({ postId }: { postId: string }) =>
    this.httpConnector
      .put(`/api/post/${postId}/unpublish`, {})
      .then((res) => res.data);

  getRandomPost = (): Promise<ApiResponse[Route.RandomPost]> =>
    this.httpConnector
      .get(createApiRoute({ route: Route.RandomPost }))
      .then((res) => res.data);

  // tags

  getAllTags = (): Promise<ApiResponse[Route.Tags]> => {
    return this.httpConnector
      .get(createApiRoute({ route: Route.Tags }))
      .then((res) => res.data);
  };

  // activity

  getUserActivity = ({
    nickname,
    page,
  }: {
    nickname: string;
    page: number;
  }): Promise<ApiResponse[Route.UserActivity]> => {
    return this.httpConnector
      .get(
        createApiRoute({
          route: Route.UserActivity,
          variable: { nickname },
          query: qs.stringify({ page }),
        })
      )
      .then((res) => res.data);
  };

  markActivityAsRead = ({ activityId }: { activityId: string }) => {
    return this.httpConnector
      .post(`/api/activity/${activityId}/markAsRead`, {})
      .then((res) => res.data);
  };

  markAllActivityAsRead = () => {
    return this.httpConnector
      .post(`/api/activity/markAllAsRead`, {})
      .then((res) => res.data);
  };

  // image upload

  uploadImage = (data: FormData): Promise<{ imageUrl: string | null }> =>
    this.httpConnector
      .request(`${window.location.origin}/api/upload-image`, {
        method: 'POST',
        data,
      })
      .then((res) => res.data);

  uploadImageToCloudFlare = (
    data: ServerFormData,
    headers: Record<string, string>
  ): Promise<{ imageUrl: string | null }> =>
    this.httpConnector
      .request(
        `client/v4/accounts/520ed574991657981b4927dda46f2477/images/v1`,
        {
          method: 'POST',
          baseURL: 'https://api.cloudflare.com',
          data,
          headers: {
            ...headers,
            Authorization: `Bearer vXd5f9tLFMrLYduwqFg0_owwaVGcfdcL8iZErPBY`,
          },
        }
      )
      .then((res) => ({ imageUrl: res.data?.result?.variants?.[0] || null }));
}
