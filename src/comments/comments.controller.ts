import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

interface JwtUser {
  userId: number;
  name: string;
  roles?: Role[];
}

interface RequestWithUser extends Request {
  user: JwtUser;
}

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Param('postId') postId: string,
    @Request() req: RequestWithUser,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    await this.commentService.createComment(
      Number(postId),
      req.user.userId,
      createCommentDto,
    );

    return {
      message: 'Comment added successfully!',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: RequestWithUser,
  ) {
    const comment = await this.commentService.findComment(Number(commentId));

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found!`);
    }

    if (comment.authorId !== req.user.userId) {
      throw new ForbiddenException('You can only edit your own comments!');
    }

    await this.commentService.updateComment(
      Number(commentId),
      updateCommentDto,
    );

    return {
      message: 'Comment updated successfully!',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Request() req: RequestWithUser,
  ) {
    const comment = await this.commentService.findComment(Number(commentId));

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found!`);
    }

    if (comment.authorId !== req.user.userId) {
      throw new ForbiddenException('You can only delete your own comments!');
    }

    await this.commentService.deleteComment(Number(commentId));

    return {
      message: 'Comment deleted successfully!',
    };
  }
}
