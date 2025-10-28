import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): string {
    return 'Home Page';
  }

  getAbout(): string {
    return 'About Page!';
  }
}
