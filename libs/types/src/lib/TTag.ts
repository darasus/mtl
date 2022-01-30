// import * as Prisma from '@prisma/client';

import { BaseEntity } from './BaseEntity';

// export type TTag = Prisma.Tag;

export interface TTag extends BaseEntity {
  name: string;
}
