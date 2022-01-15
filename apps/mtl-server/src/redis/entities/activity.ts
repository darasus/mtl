import { TActivity } from '@mtl/types';
import { Entity, Schema } from 'redis-om';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Activity extends TActivity {}

class Activity extends Entity {}

export const activitySchema = new Schema(
  Activity,
  {
    id: { type: 'string' },
    read: { type: 'boolean' },
    type: { type: 'string' },
    ownerId: { type: 'string' },
    authorId: { type: 'string' },
    updatedAt: { type: 'string' },
    createdAt: { type: 'string' },
  },
  {
    dataStructure: 'JSON',
  }
);
