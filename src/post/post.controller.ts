import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';

interface JwtUser {
  userId: number;
  name: string;
  roles?: Role[];
}

interface RequestWithUser extends Request {
  user: JwtUser;
}

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts(
    @Query('tag') tag?: string,
    @Query('authorId') authorId?: string,
  ) {
    if (tag) {
      return this.postService.findByTag(tag);
    }

    if (authorId) {
      return this.postService.findByAuthor(Number(authorId));
    }

    return this.postService.getAllPosts();
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPost(
    @Request() req: RequestWithUser,
    @Body() createPostDto: CreatePostDto,
  ) {
    await this.postService.createPost(req.user.userId, createPostDto);

    return {
      message: 'Post created successfully',
    };
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    const post = await this.postService.findPost({ id: Number(id) });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found!`);
    }

    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postService.updatePost(Number(id), updatePostDto);
    return {
      message: `Post with the title: ${post.id} updated successfully!`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postService.deletePost(Number(id));

    return {
      message: 'Post deleted successfully!',
    };
  }
}
