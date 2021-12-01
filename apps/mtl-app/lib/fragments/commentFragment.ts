import { userFragment } from "./userFragment";

export const commentFragment = {
  id: true,
  content: true,
  createdAt: true,
  postId: true,
  updatedAt: true,
  authorId: true,
  author: {
    select: userFragment,
  },
};
