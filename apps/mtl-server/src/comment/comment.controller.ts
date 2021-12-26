import {
  Controller,
  Delete,
  Param,
  UseGuards,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { PostService } from '../post/post.service';
import { ActivityService } from '../activity/activity.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CacheService } from '../cache/cache.service';
import { CacheKeyService } from '../cache/cacheKey.service';

@Controller()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService,
    private readonly activityService: ActivityService,
    private readonly cacheService: CacheService,
    private readonly cacheKeyService: CacheKeyService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Delete('comment/:commentId')
  async markActivityAsRead(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('commentId') commentId: string
  ) {
    const userId = req?.user?.sub?.split('|')?.[1];

    const isMyComment = await this.commentService.isMyComment({
      commentId,
      userId,
    });

    if (!isMyComment) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        status: 403,
        hasError: true,
        message: 'You can only delete your own comments',
      });
    }

    const post = await this.postService.findPostByCommentId(commentId);

    if (!post) return null;

    // clear post cache
    await this.cacheService.del(
      this.cacheKeyService.createPostKey({ postId: post.id })
    );

    await this.activityService.removeCommentActivity({
      commentId,
      ownerId: userId,
    });

    await this.commentService.deleteComment({
      commentId,
      postId: post.id,
      ownerId: post.authorId,
    });
  }
}
