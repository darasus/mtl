import { BaseEntity } from './BaseEntity';

export interface TLike extends BaseEntity {
  postId: string;
  authorId: string;
}
