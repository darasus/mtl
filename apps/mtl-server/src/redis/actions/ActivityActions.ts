import * as cuid from 'cuid';
import { Comment } from '../entities';
import { graph } from '../redis.graph';

export class ActivityActions {
  private createQuery({ query, params }) {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return new Comment(record.get('comment'));
      }
    });
  }

  getUserActivities({ userId }) {
    const params = { userId } as any;

    return this.createQuery({
      query: `
          MATCH (u:User)-[:HAS]->(a:Activity)
          WITH u, a
          ORDER by a.createdAt DESC
          RETURN u, a
        `,
      params,
    });
  }
}
