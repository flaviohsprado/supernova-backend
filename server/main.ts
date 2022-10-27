import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupInterceptor } from './infra/commons/utils/setupInterceptorFor.setup';
import { SetupRoute } from './infra/commons/utils/setupRouteFor.setup';
import { SetupPipeFor } from './infra/commons/utils/setupPipeFor.setup';
import { SetupContainerFor } from './infra/commons/utils/setupContainerFor.setup';

async function bootstrap() {
    const port = process.env.PORT || 3000;

    const app = await NestFactory.create(AppModule);

    SetupInterceptor.for(app);

    SetupRoute.for(app);

    SetupPipeFor.for(app);

    SetupContainerFor.for(app, AppModule);

    await app.listen(port);
}
bootstrap();