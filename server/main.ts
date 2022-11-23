import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupContainerFor } from './infra/commons/utils/setupContainerFor.setup';
import { SetupGraphqlFor } from './infra/commons/utils/setupGraphqlFor.setup';
import { SetupInterceptor } from './infra/commons/utils/setupInterceptorFor.setup';
import { SetupPipeFor } from './infra/commons/utils/setupPipeFor.setup';

async function bootstrap() {
  const port = process.env.PORT || 3010;

  const app = await NestFactory.create(AppModule);

  SetupInterceptor.for(app);

  SetupPipeFor.for(app);

  SetupContainerFor.for(app, AppModule);

  SetupGraphqlFor.for(app);

  await app.listen(port);
}
bootstrap();
