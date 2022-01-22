import { TTag } from '@mtl/types';
import * as cuid from 'cuid';
import { Tag } from '../entities';
import { graph } from '../redis.graph';

export class TagActions {
  private createQuery({ query, params }) {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return new Tag(record.get('tag'));
      }
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
    return this.createQuery({
      query: `
          MATCH (tag:Tag)
          RETURN tag
        `,
      params: null,
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
