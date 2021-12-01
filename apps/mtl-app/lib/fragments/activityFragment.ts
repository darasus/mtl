export const activityFragment = {
  author: {
    select: {
      id: true,
      name: true,
    },
  },
  post: {
    select: {
      id: true,
      title: true,
    },
  },
};
