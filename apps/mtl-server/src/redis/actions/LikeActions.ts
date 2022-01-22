import * as cuid from 'cuid';
import { graph } from '../redis.graph';

export class LikeActions {
  private createLikeQuery({
    query,
    params,
  }: {
    query: string;
    params: any;
  }): Promise<boolean> {
    return graph.query(query, params).then((like) => {
      while (like.hasNext()) {
        return true;
      }
      return false;
    });
  }

  private createRelQuery({
    query,
    params,
  }: {
    query: string;
    params: any;
  }): Promise<number> {
    return graph.query(query, params).then((post) => {
      let count = 0;
      while (post.hasNext()) {
        count++;
      }
      return count;
    });
  }

  getLikesByPostId({ postId }: { postId: string }) {
    const params = {
      postId,
    };

    return this.createRelQuery({
      query: `
          MATCH (post:Post {id: $postId})
          MATCH (post)-[k:LIKE_BY]->(n)
          RETURN k
        `,
      params,
    });
  }

  createLike({ authorId, postId }: { authorId: string; postId: string }) {
    const params = {
      id: cuid(),
      postId,
      authorId,
    };

    return this.createLikeQuery({
      query: `
          MATCH (author:User {id: $authorId})
          MATCH (post:Post {id: $postId})
          CREATE (post)-[k:LIKED_BY]->(author)
          CREATE (author)-[d:LIKED]->(post)
          RETURN k, d
        `,
      params,
    });
  }
}
