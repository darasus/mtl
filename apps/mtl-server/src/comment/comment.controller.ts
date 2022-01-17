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

@Controller()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService,
    private readonly activityService: ActivityService
  ) {}

  // TODO: migrate
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
