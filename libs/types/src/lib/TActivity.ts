// import * as Prisma from '@prisma/client';

import { BaseEntity } from './BaseEntity';

// export type TActivity = Prisma.Activity;

export interface TActivity extends BaseEntity {
  read: boolean;
  type: string;
  ownerId: string;
  authorId: string;
}
