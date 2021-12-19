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
import { Post as PostType, Request, Response } from '@mtl/types';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  codeLanguage: Prisma.CodeLanguage;
  @IsNotEmpty()
  tagId: string;
  @IsNotEmpty()
  isPublished: boolean;
}

export class UpdatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  codeLanguage: Prisma.CodeLanguage;
  @IsNotEmpty()
  tagId: string;
}

export class AddPostCommentDto {
  @IsNotEmpty()
  content: string;
}

@Controller()
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly activityService: ActivityService,
    private readonly likeService: LikeService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('post/create')
  async createPost(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreatePostDto
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];

    res.send(await this.postService.createPost(userId, body));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('post/:postId/update')
  async updatePost(
    @Res() res: Response,
    @Body() body: UpdatePostDto,
    @Param('postId') postId: string
  ) {
    res.send(await this.postService.updatePost(body, postId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('post/save')
  async markActivityAsRead(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreatePostDto
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];

    res.send(
      await this.postService.savePost(
        {
          title: body.title,
          content: body.content,
          description: body.description,
        },
        userId
      )
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('post/:postId/addComment')
  async addPostComment(
    @Req() req: Request,
    @Res() res: Response,
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

    res.send({ status: 'ok' });
  }

  @Get('post/:postId/comments')
  async getPostComments(
    @Res() res: Response,
    @Param('postId') postId: string,
    @Query('take') take: string,
    @Query('skip') skip: string
  ) {
    res.send(
      await this.commentService.getCommentsByPostId({
        postId,
        take: Number(take) || undefined,
        skip: Number(skip) || undefined,
      })
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('post/:postId')
  async deletePost(@Res() res: Response, @Param('postId') postId: string) {
    await this.postService.deletePost(postId);
    res.send({ status: 'ok' });
  }

  @UseGuards(OptionalUserGuard)
  @Get('post/:postId')
  async getPost(
    @Res() res: Response,
    @Req() req: Request,
    @Param('postId') postId: string
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];

    res.send(await this.postService.fetchPost({ postId, userId }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('post/:postId/like')
  async likePost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('postId') postId: string
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];

    const post = await this.postService.fetchPost({ postId, userId });

    if (!post) {
      return res.status(400).send({ status: 'failure' });
    }

    if (post?.isLikedByMe) {
      return res.status(400).send({ message: 'Post is already liked by you' });
    }

    const like = await this.likeService.likePost(postId, userId);
    // await cache.del(redisCacheKey.createPostKey(post.id));
    await this.activityService.addLikeActivity({
      authorId: userId,
      likeId: like.id,
      ownerId: post.authorId as string,
      postId: post.id,
    });

    res.send({ status: 'ok' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('post/:postId/unlike')
  async unlikePost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('postId') postId: string
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];

    const post = await this.postService.fetchPost({ postId, userId });

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
    // await cache.del(redisCacheKey.createPostKey(postId));
    res.send({ status: 'ok' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('post/:postId/publish')
  async publishPost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('postId') postId: string
  ) {
    res.send(await this.postService.publishPost(postId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('post/:postId/unpublish')
  async unpublishPost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('postId') postId: string
  ) {
    res.send(await this.postService.unpublishPost(postId));
  }

  @Get('post/random')
  async getRandomPost(): Promise<PostType> {
    return this.postService.getRandomPost();
  }
}
