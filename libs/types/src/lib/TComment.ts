import * as Prisma from '@prisma/client';

export type TComment = Prisma.Comment & {
  author?: Omit<Prisma.User, 'password'> | null;
};
