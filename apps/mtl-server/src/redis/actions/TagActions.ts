import { TTag } from '@mtl/types';
import * as cuid from 'cuid';
import { Tag } from '../entities';
import { graph } from '../redis.graph';

export class TagActions {
  private createQuery({ query, params }): Promise<TTag> {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        return Tag(post.next());
      }
    });
  }

  private createListQuery({ query, params }): Promise<TTag[]> {
    return graph.query(query, params).then((post) => {
      const list: TTag[] = [];
      while (post.hasNext()) {
        const record = post.next();
        list.push(Tag(record));
      }
      return list;
    });
  }

  createTag({ name }): Promise<TTag> {
    const params = {
      name,
      id: cuid(),
    };

    return this.createQuery({
      query: `CREATE (tag:Tag {id: $id, name: $name}) RETURN tag`,
      params,
    });
  }

  getAllTags(): Promise<TTag[]> {
    return this.createListQuery({
      query: `
          MATCH (tag:Tag)
          RETURN tag
        `,
      params: null,
    });
  }

  getTagsByPostId({ postId }): Promise<TTag[]> {
    const params = { postId };

    return this.createListQuery({
      query: `
          MATCH (post:Post {id: $postId})-[k:HAS_TAG]->(tag:Tag)
          RETURN tag
        `,
      params,
    });
  }

  assignTagToPost({ tagId, postId }) {
    const params = { tagId, postId };

    return this.createQuery({
      query: `
          MATCH (post:Post {id: $postId})
          MATCH (tag:Tag {id: $tagId})
          CREATE (post)-[k:HAS_TAG]->(tag)
          RETURN tag
        `,
      params,
    });
  }
}
