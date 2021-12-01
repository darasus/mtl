export const tagsFragment = {
  include: {
    tag: {
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  },
};
