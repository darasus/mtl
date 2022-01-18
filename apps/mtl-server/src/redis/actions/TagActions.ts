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

  createTag({ name }) {
    const params = {
      name,
      id: cuid(),
    } as any;

    return this.createQuery({
      query: `CREATE (tag:Tag {id: $id, name: $name}) RETURN tag`,
      params,
    });
  }

  getAllTags() {
    return this.createQuery({
      query: `
          MATCH (tag:Tag)
          RETURN tag
        `,
      params: null,
    });
  }
}
