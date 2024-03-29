import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  Post,
} from '@nestjs/common';
import { PostService } from '../post/post.service';
import { IsNotEmpty } from 'class-validator';
import * as Prisma from '@prisma/client';
import { CommentService } from '../comment/comment.service';
import { ActivityService } from '../activity/activity.service';
import { OptionalUserGuard } from '../guards/OptionalUserGuard';
import { LikeService } from '../like/like.service';
import { AuthGuard } from '@nestjs/passport';
import { TPost, Route } from '@mtl/types';
import { Response, Request } from 'express';
import { CacheService } from '../cache/cache.service';
import { CacheKeyService } from '../cache/cacheKey.service';
import { ApiResponse } from '@mtl/api-types';
import { years } from '@mtl/utils';

export class CreatePostDto {
  @IsNotEmpty()
  title!: string;
  @IsNotEmpty()
  content!: string;
  @IsNotEmpty()
  description!: string;
  @IsNotEmpty()
  codeLanguage!: Prisma.CodeLanguage;
  @IsNotEmpty()
  tagId!: string;
  @IsNotEmpty()
  isPublished!: boolean;
}

export class UpdatePostDto {
  @IsNotEmpty()
  title!: string;
  @IsNotEmpty()
  content!: string;
  @IsNotEmpty()
  description!: string;
  @IsNotEmpty()
  codeLanguage!: Prisma.CodeLanguage;
  @IsNotEmpty()
  tagId!: string;
}

export class AddPostCommentDto {
  @IsNotEmpty()
  content!: string;
}

@Controller()
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly activityService: ActivityService,
    private readonly likeService: LikeService,
    private readonly cacheService: CacheService,
    private readonly cachekeyService: CacheKeyService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('post/create')
  async createPost(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: CreatePostDto
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];

    return this.postService.createPost(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('post/:postId/update')
  async updatePost(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() body: UpdatePostDto,
    @Param('postId') postId: string
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];
    const post = await this.postService.updatePost({ ...body, postId, userId });

    // clear post cache
    await this.cacheService.del(this.cachekeyService.createPostKey({ postId }));

    return post;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('post/save')
  async markActivityAsRead(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: CreatePostDto
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];

    const post = this.postService.savePost(
      {
        title: body.title,
        content: body.content,
        description: body.description,
      },
      userId
    );

    return post;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('post/:postId/addComment')
  async addPostComment(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string,
    @Body() body: AddPostCommentDto
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];
    const comment = await this.commentService.addComment({
      content: String(body.content),
      postId,
      userId,
    });
    const post = await this.postService.fetchPost({ postId });
    await this.activityService.addCommentActivity({
      postId,
      authorId: userId,
      commentId: comment.id,
      ownerId: post?.authorId as string,
    });

    // clear post cache
    await this.cacheService.del(this.cachekeyService.createPostKey({ postId }));

    return { status: 'ok' };
  }

  @Get(Route.PostComments)
  async getPostComments(
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string,
    @Query('take') take: string,
    @Query('skip') skip: string
  ): Promise<ApiResponse[Route.PostComments]> {
    return this.commentService.getCommentsByPostId({
      postId,
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('post/:postId')
  async deletePost(
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string
  ) {
    await this.postService.deletePost(postId);
    return { status: 'ok' };
  }

  @UseGuards(OptionalUserGuard)
  @Get(Route.Post)
  async getPost(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Param('postId') postId: string
  ): Promise<ApiResponse[Route.Post]> {
    const userId = req?.user?.sub?.split('|')?.[1];
    const post = await this.cacheService.fetch(
      this.cachekeyService.createPostKey({ postId }),
      () => this.postService.fetchPost({ postId, userId }),
      years(1)
    );

    return post;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('post/:postId/like')
  async likePost(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];

    const post = await this.cacheService.fetch<TPost>(
      this.cachekeyService.createPostKey({ postId }),
      () => this.postService.fetchPost({ postId, userId }),
      years(1)
    );

    if (!post) {
      return res.status(400).send({ status: 'failure' });
    }

    if (post?.isLikedByMe) {
      return res.status(400).send({ message: 'Post is already liked by you' });
    }

    const like = await this.likeService.likePost(postId, userId);

    // clear post cache
    await this.cacheService.del(this.cachekeyService.createPostKey({ postId }));

    await this.activityService.addLikeActivity({
      authorId: userId,
      likeId: like.id,
      ownerId: post.authorId as string,
      postId: post.id,
    });

    return { status: 'ok' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('post/:postId/unlike')
  async unlikePost(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];

    const post = await this.cacheService.fetch<TPost>(
      this.cachekeyService.createPostKey({ postId }),
      () => this.postService.fetchPost({ postId, userId }),
      years(1)
    );

    if (!post) {
      return res.status(400).send({ status: 'failure' });
    }

    if (!post?.isLikedByMe) {
      return res.status(400).send({ message: 'Post is not liked by you yet' });
    }

    await this.activityService.removeLikeActivity({
      postId,
      authorId: userId,
      ownerId: post?.authorId as string,
    });

    await this.likeService.unlikePost(postId, userId);

    // clear post cache
    await this.cacheService.del(this.cachekeyService.createPostKey({ postId }));

    return { status: 'ok' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('post/:postId/publish')
  async publishPost(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string
  ) {
    // clear post cache
    await this.cacheService.del(this.cachekeyService.createPostKey({ postId }));

    return this.postService.publishPost(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('post/:postId/unpublish')
  async unpublishPost(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('postId') postId: string
  ) {
    // clear post cache
    await this.cacheService.del(this.cachekeyService.createPostKey({ postId }));

    return this.postService.unpublishPost(postId);
  }

  @Get(Route.RandomPost)
  async getRandomPost(): Promise<ApiResponse[Route.RandomPost]> {
    return this.postService.getRandomPost();
  }
}
