import * as cuid from 'cuid';
import { Comment } from '../entities';
import { graph } from '../redis.graph';

export class CommentActions {
  private createCommentQuery({ query, params }) {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return new Comment(record.get('comment'));
      }
    });
  }

  getComment({ commentId }) {
    const params = {
      id: commentId,
    } as any;

    return this.createCommentQuery({
      query: `
          Match (comment:Comment {id: $id})
          RETURN comment
        `,
      params,
    });
  }

  createComment({ content, authorId, postId }) {
    const params = {
      id: cuid(),
      postId,
      authorId,
      content,
    } as any;

    return this.createCommentQuery({
      query: `
          MATCH (author:User {id: $authorId})
          MATCH (post:Post {id: $postId})
          CREATE (comment:Comment { id: $id, content: $content })
          CREATE (comment)-[:COMMENTED_BY]->(author)
          CREATE (post)-[:HAS_COMMENT]->(comment)
          RETURN comment
        `,
      params,
    });
  }

  deleteComment({ commentId }) {
    const params = {
      id: commentId,
    } as any;

    return this.createCommentQuery({
      query: `
          Match (comment:Comment {id: $id})
          DELETE comment
        `,
      params,
    });
  }
}
