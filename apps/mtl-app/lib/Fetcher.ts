import { CodeLanguage } from '.prisma/client';
import { Post } from '../types/Post';
import { User } from '../types/User';
import qs from 'query-string';
import { HttpConnector } from './HttpConnector';
import { FeedType } from '../types/FeedType';
import ServerFormData from 'form-data';
import { ApiResponse } from '@mtl/api-types';
import getConfig from 'next/config';
import { rejectNil } from '../utils/rejectNil';

export class Fetcher {
  httpConnector: HttpConnector;

  constructor(httpConnector: HttpConnector) {
    this.httpConnector = httpConnector;
  }

  // auth

  refetchAuthUserProfile = (): Promise<void> =>
    this.httpConnector.request.get(
      `${window.location.origin}/api/auth/refetch`
    );

  // user

  getMe = (): Promise<User> =>
    this.httpConnector.request('/api/me').then((res) => res.data);

  getUser = ({ nickname }: { nickname: string }): Promise<User> =>
    this.httpConnector.request(`/api/user/${nickname}`).then((res) => res.data);

  getUserPosts = ({
    nickname,
    cursor,
    tags,
  }: {
    nickname: string;
    cursor?: string;
    tags?: string[];
  }): Promise<ApiResponse['user/:nickname/posts']> => {
    const query = qs.stringify(
      rejectNil({
        cursor,
        tags: tags?.length > 0 ? tags?.join(',') : null,
      })
    );
    console.log({ query });
    return this.httpConnector
      .request(`/api/user/${nickname}/posts?${query}`)
      .then((res) => res.data);
  };

  invalidateUser = ({
    nickname,
  }: {
    nickname: string;
  }): Promise<{ status: 'success' }> =>
    this.httpConnector
      .request(`/api/user/${nickname}/invalidate`, {
        method: 'POST',
        data: {},
      })
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
  }): Promise<ApiResponse['user/:nickname/tags']> =>
    this.httpConnector
      .get(`/api/user/${nickname}/tags`)
      .then((res) => res.data);

  // like

  likePost = ({ postId }: { postId: string }) =>
    this.httpConnector
      .request(`/api/post/${postId}/like`, {
        method: 'POST',
      })
      .then((res) => res.data);

  unlikePost = ({ postId }: { postId: string }) =>
    this.httpConnector
      .request(`/api/post/${postId}/unlike`, {
        method: 'POST',
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
  }) =>
    this.httpConnector
      .request(`/api/post/${postId}/comments?${qs.stringify({ take, skip })}`)
      .then((res) => res.data);

  addComment = ({ postId, content }: { postId: string; content: string }) =>
    this.httpConnector
      .request(`/api/post/${postId}/addComment`, {
        method: 'POST',
        data: {
          content,
        },
      })
      .then((res) => res.data);

  deleteComment = ({ commentId }: { commentId: string }) =>
    this.httpConnector
      .request(`/api/comment/${commentId}`, {
        method: 'DELETE',
      })
      .then((res) => res.data);

  // follow

  doIFollowUser = ({ nickname }: { nickname: string }) =>
    this.httpConnector
      .request(`/api/user/${nickname}/follow`)
      .then((res) => res.data);

  getFollowersCount = ({ nickname }: { nickname: string }) =>
    this.httpConnector
      .request(`/api/user/${nickname}/follow/count`)
      .then((res) => res.data);

  getFollowingsCount = ({ nickname }: { nickname: string }) =>
    this.httpConnector
      .request(`/api/user/${nickname}/followings/count`)
      .then((res) => res.data);

  followUser = ({ nickname }: { nickname: string }) =>
    this.httpConnector
      .request(`/api/user/${nickname}/follow`, {
        method: 'POST',
      })
      .then((res) => res.data);

  unfollowUser = ({ nickname }: { nickname: string }) =>
    this.httpConnector
      .request(`/api/user/${nickname}/unfollow`, {
        method: 'POST',
      })
      .then((res) => res.data);

  // feed

  getFeed = ({
    cursor,
    feedType,
  }: {
    cursor?: string;
    feedType: FeedType;
  }): Promise<ApiResponse['user/:nickname/posts']> =>
    this.httpConnector
      .request(
        `/api/feed?${qs.stringify({
          cursor,
          feedType,
        })}`
      )
      .then((res) => res.data);

  // post

  getPost = ({ postId }: { postId: string }): Promise<Post> =>
    this.httpConnector.request(`/api/post/${postId}`).then((res) => res.data);

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
    this.httpConnector
      .request(`/api/post/create`, {
        method: 'POST',
        data,
      })
      .then((res) => res.data);

  deletePost = (postId: string) =>
    this.httpConnector
      .request(`/api/post/${postId}`, {
        method: 'DELETE',
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
  ) =>
    this.httpConnector
      .request(`/api/post/${postId}/update`, {
        method: 'PUT',
        data,
      })
      .then((res) => res.data);

  publishPost = ({ postId }: { postId: string }) =>
    this.httpConnector
      .request(`/api/post/${postId}/publish`, {
        method: 'PUT',
      })
      .then((res) => res.data);

  unpublishPost = ({ postId }: { postId: string }) =>
    this.httpConnector
      .request(`/api/post/${postId}/unpublish`, {
        method: 'PUT',
      })
      .then((res) => res.data);

  getRandomPost = (): Promise<Post> =>
    this.httpConnector.request(`/api/post/random`, {}).then((res) => res.data);

  // tags

  getAllTags = () => {
    return this.httpConnector.request(`/api/tags`).then((res) => res.data);
  };

  // activity

  getUserActivity = ({
    nickname,
    cursor,
  }: {
    nickname: string;
    cursor: string;
  }) => {
    return this.httpConnector
      .request(
        `${
          getConfig().publicRuntimeConfig.API_BASE_URL
        }/api/user/${nickname}/activity?${qs.stringify({ cursor })}`
      )
      .then((res) => res.data);
  };

  markActivityAsRead = ({ activityId }: { activityId: string }) => {
    return this.httpConnector
      .request(`/api/activity/${activityId}/markAsRead`, { method: 'POST' })
      .then((res) => res.data);
  };

  markAllActivityAsRead = () => {
    return this.httpConnector
      .request(`/api/activity/markAllAsRead`, { method: 'POST' })
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
