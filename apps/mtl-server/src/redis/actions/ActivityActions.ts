import * as cuid from 'cuid';
import { Activity } from '../entities';
import { graph } from '../redis.graph';
import { ApiPage, TActivity } from '@mtl/types';

export class ActivityActions {
  private createQuery({
    query,
    params,
  }: {
    query: string;
    params: any;
  }): Promise<TActivity> {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return Activity(
          record.get('activity'),
          record.get('author'),
          record.get('post')
        );
      }
    });
  }

  private createCountrQuery({
    query,
    params,
  }: {
    query: string;
    params: any;
  }): Promise<number> {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return record.get('COUNT (activity)') as any;
      }
    });
  }

  private createListQuery({ query, params }: { query: string; params: any }) {
    return graph.query(query, params).then((post) => {
      const list: TActivity[] = [];
      while (post.hasNext()) {
        const record = post.next();
        list.push(
          Activity(
            record.get('activity'),
            record.get('author'),
            record.get('post')
          )
        );
      }
      return list;
    });
  }

  createLikeActivity({
    postId,
    authorId,
    ownerId,
  }: {
    postId: string;
    authorId: string;
    ownerId: string;
  }): Promise<TActivity> {
    const params = {
      id: cuid(),
      postId,
      authorId,
      ownerId,
      type: 'LIKE',
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.createQuery({
      query: `
        MATCH (post:Post {id: $postId})
        MATCH (owner:User {id: $ownerId})
        MATCH (author:User {id: $authorId})
        CREATE (activity:Activity {id: $id, type: $type, postId: $postId, read: $read, createdAt: $createdAt, updatedAt: $updatedAt })
        CREATE (activity)-[a:AUTHORED_BY]->(author)
        CREATE (activity)-[b:OWNED_BY]->(owner)
        CREATE (owner)-[c:HAS_ACTIVITY]->(activity)
        RETURN activity, author, post
      `,
      params,
    });
  }

  createCommentActivity({
    postId,
    authorId,
    ownerId,
  }: {
    postId: string;
    authorId: string;
    ownerId: string;
  }): Promise<TActivity> {
    const params = {
      id: cuid(),
      postId,
      authorId,
      ownerId,
      type: 'COMMENT',
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.createQuery({
      query: `
        MATCH (post:Post {id: $postId})
        MATCH (owner:User {id: $ownerId})
        MATCH (author:User {id: $authorId})
        CREATE (activity:Activity {id: $id, type: $type, postId: $postId, read: $read, createdAt: $createdAt, updatedAt: $updatedAt })
        CREATE (activity)-[a:AUTHORED_BY]->(author)
        CREATE (activity)-[b:OWNED_BY]->(owner)
        CREATE (owner)-[c:HAS_ACTIVITY]->(activity)
        RETURN activity, author, post
      `,
      params,
    });
  }

  createFollowActivity({
    authorId,
    ownerId,
  }: {
    authorId: string;
    ownerId: string;
  }): Promise<TActivity> {
    const params = {
      id: cuid(),
      authorId,
      ownerId,
      type: 'FOLLOW',
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.createQuery({
      query: `
        MATCH (owner:User {id: $ownerId})
        MATCH (author:User {id: $authorId})
        CREATE (activity:Activity {id: $id, type: $type, read: $read, createdAt: $createdAt, updatedAt: $updatedAt })
        CREATE (activity)-[a:AUTHORED_BY]->(author)
        CREATE (activity)-[b:OWNED_BY]->(owner)
        CREATE (owner)-[c:HAS_ACTIVITY]->(activity)
        RETURN activity, author
      `,
      params,
    });
  }

  async getUserActivities({
    nickname,
    page = 1,
  }: {
    nickname: string;
    page: number;
  }): Promise<ApiPage<TActivity>> {
    const pageSize = 25;
    const take = pageSize;
    const skip = take * page;
    const params = { nickname };

    const activity = await this.createListQuery({
      query: `
          MATCH (author:User {nickname: $nickname})-[h:HAS_ACTIVITY]->(activity:Activity)
          OPTIONAL MATCH (post:Post {id: activity.postId})
          RETURN activity, author, post
          ORDER BY activity.createdAt DESC
          SKIP ${skip}
          LIMIT ${take}
        `,
      params,
    });

    const total = await this.createCountrQuery({
      query: `
          MATCH (author:User {nickname: $nickname})-[h:HAS_ACTIVITY]->(activity:Activity)
          RETURN COUNT (activity)
        `,
      params,
    });

    return {
      items: activity,
      count: activity.length,
      total,
      currPage: page,
      nextPage: skip <= total ? page + 1 : null,
    };
  }
}
