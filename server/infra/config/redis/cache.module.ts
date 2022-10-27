import { ConfigModule } from '@nestjs/config';
import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ClientOpts } from 'redis';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { CacheService } from './cache.service';

export const getRedisModuleConfig = (config: EnvironmentConfigService): any =>
  CacheModule.register<ClientOpts>({
    store: redisStore,
    host: config.getRedisHost(),
    port: config.getRedisPort(),
    ttl: 60,
  });

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      ttl: 60,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheConfigModule {}
