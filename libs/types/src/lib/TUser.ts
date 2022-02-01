import * as Prisma from '@prisma/client';

export type TUser = Omit<Prisma.User, 'password'>;
