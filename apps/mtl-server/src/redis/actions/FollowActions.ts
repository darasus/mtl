import * as cuid from 'cuid';
import { Follow } from '../entities';
import { graph } from '../redis.graph';

export class FollowActions {
  private createQuery({ query, params }) {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        return true;
      }
    });
  }

  createFollow({ followerId, followingId }): Promise<boolean | undefined> {
    const params = {
      followerId,
      followingId,
    } as any;

    return this.createQuery({
      query: `
        MATCH (a:User), (b:User)
        WHERE a.id = $followingId AND b.id = $followerId
        CREATE (b)-[r:FOLLOWS]->(a)
        RETURN type(r)
      `,
      params,
    });
  }
}
