import * as cuid from 'cuid';
import { Post } from '../entities';
import { graph } from '../redis.graph';

export class PostActions {
  private createPostQuery({ query, params }) {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return new Post(record.get('post'));
      }
    });
  }

  fetchPost({ postId }) {
    const params = {
      id: postId,
    } as any;

    return this.createPostQuery({
      query: `
          Match (post:Post {id: $id})
          RETURN post
        `,
      params,
    });
  }

  createPost({
    title,
    content,
    description,
    codeLanguage,
    tagIds,
    isPublished,
    userId,
  }) {
    const params = {
      id: cuid(),
      title,
      content,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      codeLanguage,
      tagIds,
      isPublished,
      userId,
    } as any;

    return this.createPostQuery({
      query: `
          MATCH (author:User {id: $userId})
          CREATE (post:Post { id: $id, title: $title, content: $content, description: $description, createdAt: $createdAt, updatedAt: $updatedAt, codeLanguage: $codeLanguage, tagIds: $tagIds, isPublished: $isPublished })
          CREATE (post)-[:POSTED_BY]->(user:User { id: $userId })
          CREATE (author)-[:POSTED]->(post)
          RETURN post
        `,
      params,
    });
  }

  updatePost({ id, title, content, description, codeLanguage, tagIds }) {
    const params = {
      id,
      title,
      content,
      description,
      codeLanguage,
      updatedAt: new Date().toISOString(),
      tagIds,
    } as any;

    return this.createPostQuery({
      query: `
          Match (post:Post {id: $id})
          SET post.title = $title, post.content = $content, post.description = $description, post.updatedAt = $updatedAt, post.codeLanguage = $codeLanguage, tagIds: $tagIds,
          RETURN post
        `,
      params,
    });
  }

  publishPost({ postId }) {
    const params = {
      id: postId,
      isPublished: true,
    } as any;

    return this.createPostQuery({
      query: `
          Match (post:Post {id: $id})
          SET post.isPublished = $isPublished
          RETURN post
        `,
      params,
    });
  }

  unpublishPost({ postId }) {
    const params = {
      id: postId,
      isPublished: false,
    } as any;

    return this.createPostQuery({
      query: `
          Match (post:Post {id: $id})
          SET post.isPublished = $isPublished
          RETURN post
        `,
      params,
    });
  }

  deletePost({ postId }) {
    const params = {
      id: postId,
    } as any;

    return this.createPostQuery({
      query: `
          Match (post:Post {id: $id})
          DELETE post
        `,
      params,
    });
  }
}
