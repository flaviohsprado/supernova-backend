import { DynamicModule, INestApplication, Type } from '@nestjs/common';
import { useContainer } from 'class-validator';

export class SetupContainerFor {
  static for(app: INestApplication, appModule: DynamicModule | Type<unknown>) {
    useContainer(app.select(appModule), { fallbackOnErrors: true });
  }
}
