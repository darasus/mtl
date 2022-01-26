import { BaseEntity } from './BaseEntity';

export interface TComment extends BaseEntity {
  postId: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  content: string;
}
