import * as cuid from 'cuid';
import { Comment } from '../entities';
import { graph } from '../redis.graph';

export class CommentActions {
  private createCommentQuery({
    query,
    params,
  }: {
    query: string;
    params: any;
  }) {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return Comment(record.get('comment'));
      }
    });
  }

  getComment({ commentId }: { commentId: string }) {
    const params = {
      id: commentId,
    };

    return this.createCommentQuery({
      query: `
          Match (comment:Comment {id: $id})
          RETURN comment
        `,
      params,
    });
  }

  createComment({
    content,
    authorId,
    postId,
  }: {
    content: string;
    authorId: string;
    postId: string;
  }) {
    const params = {
      id: cuid(),
      postId,
      authorId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.createCommentQuery({
      query: `
          MATCH (author:User {id: $authorId})
          MATCH (post:Post {id: $postId})
          CREATE (comment:Comment { id: $id, content: $content, createdAt: $createdAt, updatedAt: $updatedAt })
          CREATE (comment)-[:COMMENTED_BY]->(author)
          CREATE (post)-[:HAS_COMMENT]->(comment)
          RETURN comment
        `,
      params,
    });
  }

  deleteComment({ commentId }: { commentId: string }) {
    const params = {
      id: commentId,
    };

    return this.createCommentQuery({
      query: `
          Match (comment:Comment {id: $id})
          DELETE comment
        `,
      params,
    });
  }
}
