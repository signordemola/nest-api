import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ValidatedUser } from './strategies/local.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    return {
      userId: user.id,
      name: user.name,
      roles: user.roles,
    };
  }

  async login(user: ValidatedUser) {
    const payload = { name: user.name, sub: user.userId, roles: user.roles };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.userId,
        name: user.name,
        roles: user.roles,
      },
    };
  }
}
