import { ApiPage, TPost } from '@mtl/types';
import { CodeLanguage } from '@prisma/client';
import * as cuid from 'cuid';
import { Post } from '../entities';
import { graph } from '../redis.graph';
import { TagActions } from './TagActions';

export class PostActions {
  private createQuery({ query, params }: { query: string; params: any }) {
    return graph.query(query, params).then((post) => {
      while (post.hasNext()) {
        const record = post.next();
        return Post(record.get('post'));
      }
    });
  }

  private createListQuery({ query, params }: { query: string; params: any }) {
    return graph.query(query, params).then((post) => {
      const list: TPost[] = [];
      while (post.hasNext()) {
        const record = post.next();
        list.push(Post(record.get('post')));
      }
      return list;
    });
  }

  fetchPost({ postId }: { postId: string }) {
    const params = {
      id: postId,
    };

    return this.createQuery({
      query: `
          Match (post:Post {id: $id})
          RETURN post
        `,
      params,
    });
  }

  async createPost({
    title,
    content,
    description,
    codeLanguage,
    tagIds,
    isPublished,
    userId,
  }: {
    title: string;
    content: string;
    description: string;
    codeLanguage: CodeLanguage;
    tagIds: string[];
    isPublished: boolean;
    userId: string;
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
    };

    const post = await this.createQuery({
      query: `
          MATCH (author:User {id: $userId})
          CREATE (post:Post { id: $id, title: $title, content: $content, description: $description, createdAt: $createdAt, updatedAt: $updatedAt, codeLanguage: $codeLanguage, isPublished: $isPublished })
          CREATE (post)-[r:POSTED_BY]->(author)
          CREATE (author)-[a:POSTED]->(post)
          RETURN post
        `,
      params,
    });

    if (tagIds && tagIds.length > 0) {
      const tagActions = new TagActions();
      for (const tagId of tagIds) {
        await tagActions.assignTagToPost({ tagId, postId: post?.id as string });
      }
    }

    return post;
  }

  updatePost({
    id,
    title,
    content,
    description,
    codeLanguage,
    tagIds,
  }: {
    id: string;
    title: string;
    content: string;
    description: string;
    codeLanguage: CodeLanguage;
    tagIds: string[];
  }) {
    const params = {
      id,
      title,
      content,
      description,
      codeLanguage,
      updatedAt: new Date().toISOString(),
      tagIds,
    };

    return this.createQuery({
      query: `
          Match (post:Post {id: $id})
          SET post.title = $title, post.content = $content, post.description = $description, post.updatedAt = $updatedAt, post.codeLanguage = $codeLanguage, tagIds: $tagIds,
          RETURN post
        `,
      params,
    });
  }

  publishPost({ postId }: { postId: string }) {
    const params = {
      id: postId,
      isPublished: true,
    };

    return this.createQuery({
      query: `
          Match (post:Post {id: $id})
          SET post.isPublished = $isPublished
          RETURN post
        `,
      params,
    });
  }

  unpublishPost({ postId }: { postId: string }) {
    const params = {
      id: postId,
      isPublished: false,
    };

    return this.createQuery({
      query: `
          MATCH (post:Post {id: $id})
          SET post.isPublished = $isPublished
          RETURN post
        `,
      params,
    });
  }

  deletePost({ postId }: { postId: string }) {
    const params = {
      id: postId,
    };

    return this.createQuery({
      query: `
          MATCH (post:Post {id: $id})
          DELETE post
        `,
      params,
    });
  }

  async getUserPosts({
    nickname,
  }: {
    nickname: string;
  }): Promise<ApiPage<TPost>> {
    const params = {
      nickname,
    };

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
      currPage: 1,
      nextPage: 1,
    };
  }
}
