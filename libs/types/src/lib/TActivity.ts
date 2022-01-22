import { ActivityType } from './ActivityType';
import { BaseEntity } from './BaseEntity';
import { TPost } from './TPost';
import { TUser } from './TUser';

export interface TActivity extends BaseEntity {
  read: boolean;
  type: ActivityType;
  postId: string;
  author: TUser;
  post: TPost;
}
