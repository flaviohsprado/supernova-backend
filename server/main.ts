import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupContainerFor } from './infra/commons/utils/setupContainerFor.setup';
import { SetupInterceptor } from './infra/commons/utils/setupInterceptorFor.setup';
import { SetupPipeFor } from './infra/commons/utils/setupPipeFor.setup';

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);

  SetupInterceptor.for(app);

  SetupPipeFor.for(app);

  SetupContainerFor.for(app, AppModule);

  await app.listen(port);
}
bootstrap();
