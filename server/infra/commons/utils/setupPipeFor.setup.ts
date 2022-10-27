import { INestApplication, ValidationPipe } from '@nestjs/common';

export class SetupPipeFor {
  static for(app: INestApplication) {
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }
}
