import { ApiPage, TActivity } from '@mtl/types';
import * as cuid from 'cuid';
import { Activity } from '../entities';
import { graph } from '../redis.graph';

export class ActivityActions {
  private createQuery({ query, params }) {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return new Activity(record.get('activity'));
      }
    });
  }

  private createListQuery({ query, params }) {
    return graph.query(query, params).then((post) => {
      const list = [];
      while (post.hasNext()) {
        const record = post.next();
        list.push(new Activity(record.get('activity')));
      }
      return list;
    });
  }

  async getUserActivities({ nickname }): Promise<ApiPage<TActivity>> {
    const params = { nickname } as any;

    const activity = await this.createListQuery({
      query: `
          MATCH (user:User {nickname: $nickname})-[h:HAS]->(activity:Activity)
          RETURN activity
        `,
      params,
    });

    return {
      items: activity,
      total: activity.length,
      count: activity.length,
      cursor: null,
    };
  }
}
