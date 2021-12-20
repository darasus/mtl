import * as Prisma from '@prisma/client';

export type User = Omit<Prisma.User, 'password'>;
