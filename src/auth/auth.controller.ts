import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '@/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { name, email, password, username } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      return {
        message: 'Email already in use!',
        status: HttpStatus.CONFLICT,
      };
    }

    await this.userService.createUser(name, email, password, username);

    return {
      message: 'Registration successful!',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;

    const validatedUser = await this.authService.validateUser(email, password);

    if (!validatedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.login(validatedUser);

    return {
      message: 'Login successful',
      ...token,
    };
  }
}
