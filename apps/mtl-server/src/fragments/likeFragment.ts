import { userFragment } from "./userFragment";

export const likeFragment = {
  id: true,
  postId: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
  author: {
    select: userFragment,
  },
};
