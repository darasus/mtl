import { BaseEntity } from './BaseEntity';
import { TUser } from './TUser';

export interface TComment extends BaseEntity {
  postId: string;
  authorId: string;
  content: string;
  author: TUser;
}
