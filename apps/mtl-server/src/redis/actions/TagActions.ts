import * as cuid from 'cuid';
import { Comment } from '../entities';
import { graph } from '../redis.graph';

export class TagActions {
  private createTagQuery({ query, params }) {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return new Comment(record.get('comment'));
      }
    });
  }

  getAllTags() {
    return this.createTagQuery({
      query: `
          Match (tag:Tag)
          RETURN tag
        `,
      params: null,
    });
  }
}
