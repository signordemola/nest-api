import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(
    postId: number,
    authorId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        post: { connect: { id: postId } },
        author: { connect: { id: authorId } },
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findComment(id: number) {
    return this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true },
        },
        post: {
          select: { id: true, title: true },
        },
      },
    });
  }

  async updateComment(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findComment(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return this.prisma.comment.update({
      where: { id },
      data: {
        ...(updateCommentDto.content !== undefined && {
          content: updateCommentDto.content,
        }),
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async deleteComment(id: number) {
    const comment = await this.findComment(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
