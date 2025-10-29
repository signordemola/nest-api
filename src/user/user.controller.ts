import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Role } from '@/auth/enums/role.enum';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';

interface JwtUser {
  userId: number;
  name: string;
  roles?: Role[];
}

interface RequestWithUser extends Request {
  user: JwtUser;
}

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get All Users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('users')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Get Current User Profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    return this.userService.findUser({ id: req.user.userId });
  }

  // Update Current User Profile
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Body() data: Prisma.UserUpdateInput,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.updateUser({
      where: { id: req.user.userId },
      data,
    });
  }

  // Get Specific User (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('users/:id')
  async findUser(@Param('id') id: string) {
    return this.userService.findUser({ id: Number(id) });
  }

  // Delete User (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
