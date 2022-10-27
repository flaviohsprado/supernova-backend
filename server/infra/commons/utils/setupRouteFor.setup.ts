import { INestApplication } from '@nestjs/common';

export class SetupRoute {
  static for(app: INestApplication) {
    app.enableCors({
      origin: '*',
      methods: 'GET,PUT,POST,DELETE',
      optionsSuccessStatus: 200,
    });
  }
}
