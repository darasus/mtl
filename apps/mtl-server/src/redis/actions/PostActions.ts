import { ApiPage, TPost } from '@mtl/types';
import * as cuid from 'cuid';
import { Post } from '../entities';
import { graph } from '../redis.graph';

export class PostActions {
  private createQuery({ query, params }) {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return new Post(record.get('post'));
      }
    });
  }

  private createListQuery({ query, params }) {
    return graph.query(query, params).then((post) => {
      const list: TPost[] = [];
      while (post.hasNext()) {
        const record = post.next();
        list.push(new Post(record.get('post')));
      }
      return list;
    });
  }

  fetchPost({ postId }) {
    const params = {
      id: postId,
    } as any;

    return this.createQuery({
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
      isPublished,
      userId,
    } as any;

    return this.createQuery({
      query: `
          MATCH (author:User {id: $userId})
          CREATE (post:Post { id: $id, title: $title, content: $content, description: $description, createdAt: $createdAt, updatedAt: $updatedAt, codeLanguage: $codeLanguage, isPublished: $isPublished })
          CREATE (post)-[r:POSTED_BY]->(author)
          CREATE (author)-[a:POSTED]->(post)
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

    return this.createQuery({
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

    return this.createQuery({
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

    return this.createQuery({
      query: `
          MATCH (post:Post {id: $id})
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

    return this.createQuery({
      query: `
          MATCH (post:Post {id: $id})
          DELETE post
        `,
      params,
    });
  }

  async getUserPosts({ nickname }): Promise<ApiPage<TPost>> {
    const params = {
      nickname,
    } as any;

    const posts = await this.createListQuery({
      query: `
          MATCH (user:User {nickname: $nickname})-[p:POSTED]->(post:Post)
          RETURN post
        `,
      params,
    });

    return {
      items: posts,
      count: posts.length,
      total: posts.length,
      cursor: null,
    };
  }
}
