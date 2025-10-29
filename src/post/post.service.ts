import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPosts(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: {
        author: { select: { id: true, name: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true } },
          },
        },
        tags: true,
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPost(authorId: number, createPostDto: CreatePostDto) {
    const { title, content, tags } = createPostDto;

    return this.prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: authorId } },
        ...(tags && tags.length
          ? {
              tags: {
                connectOrCreate: tags.map((name) => ({
                  where: { name },
                  create: { name },
                })),
              },
            }
          : {}),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: true,
        comments: {
          include: {
            author: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async findByTag(tagName: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        tags: {
          some: {
            name: tagName,
          },
        },
      },
      include: {
        author: true,
        tags: true,
      },
    });
  }

  async findByAuthor(authorId: number): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { authorId },
      include: {
        tags: true,
        _count: {
          select: { comments: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPost(where: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.findUnique({
      where,
      include: {
        author: { select: { id: true, name: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true } },
          },
        },
        tags: true,
      },
    });
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const existingPost = await this.findPost({ id });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const { title, content, tags } = updatePostDto;

    return this.prisma.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(tags &&
          tags.length > 0 && {
            tags: {
              set: [],
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            },
          }),
      },
      include: {
        author: { select: { id: true, name: true } },
        tags: true,
        comments: {
          include: {
            author: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async deletePost(id: number) {
    const existingPost = await this.findPost({ id });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
