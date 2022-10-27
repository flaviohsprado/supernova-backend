import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';

export const getCacheModuleOptions = (
  config: EnvironmentConfigService,
): any => ({
  isGlobal: true,
  host: config.getRedisHost(),
  port: config.getRedisPort(),
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getCacheModuleOptions,
    }),
  ],
})
export class RedisConfigModule {}
