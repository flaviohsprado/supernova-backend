import { DynamicModule, Module } from '@nestjs/common';
import {
  CreateAlbumUseCase,
  DeleteAlbumUseCase,
  FindAllAlbumUseCase,
  FindOneAlbumUseCase,
  UpdateAlbumUseCase
} from '../../../domain/use-cases/album';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { CacheConfigModule } from '../../config/redis/cache.module';
import { CacheService } from '../../config/redis/cache.service';
import { ExceptionsModule } from '../../exceptions/exceptions.module';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';
import { DatabaseAlbumRepository } from '../../repositories/album.repository';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecase-proxy';

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    CacheConfigModule,
  ],
})
export class AlbumUsecasesProxyModule {
  static GET_ALBUM_USECASES_PROXY = 'getAlbumUsecasesProxy';
  static GET_ALBUMS_USECASES_PROXY = 'getAlbumsUsecasesProxy';
  static POST_ALBUM_USECASES_PROXY = 'postAlbumUsecasesProxy';
  static DELETE_ALBUM_USECASES_PROXY = 'deleteAlbumUsecasesProxy';
  static PUT_ALBUM_USECASES_PROXY = 'putAlbumUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: AlbumUsecasesProxyModule,
      providers: [
        {
          inject: [DatabaseAlbumRepository, CacheService],
          provide: AlbumUsecasesProxyModule.GET_ALBUMS_USECASES_PROXY,
          useFactory: (
            repository: DatabaseAlbumRepository,
            cacheService: CacheService,
          ) =>
            new UseCaseProxy(new FindAllAlbumUseCase(repository, cacheService)),
        },
        {
          inject: [DatabaseAlbumRepository, ExceptionsService, CacheService],
          provide: AlbumUsecasesProxyModule.GET_ALBUM_USECASES_PROXY,
          useFactory: (
            repository: DatabaseAlbumRepository,
            exceptionService: ExceptionsService,
            cacheService: CacheService,
          ) =>
            new UseCaseProxy(
              new FindOneAlbumUseCase(
                repository,
                exceptionService,
                cacheService,
              ),
            ),
        },
        {
          inject: [LoggerService, DatabaseAlbumRepository],
          provide: AlbumUsecasesProxyModule.POST_ALBUM_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: DatabaseAlbumRepository,
          ) =>
            new UseCaseProxy(
              new CreateAlbumUseCase(logger, repository),
            ),
        },
        {
          inject: [LoggerService, DatabaseAlbumRepository],
          provide: AlbumUsecasesProxyModule.PUT_ALBUM_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: DatabaseAlbumRepository,
          ) =>
            new UseCaseProxy(
              new UpdateAlbumUseCase(logger, repository),
            ),
        },
        {
          inject: [LoggerService, DatabaseAlbumRepository, ExceptionsService],
          provide: AlbumUsecasesProxyModule.DELETE_ALBUM_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: DatabaseAlbumRepository,
            exceptionService: ExceptionsService
          ) => new UseCaseProxy(new DeleteAlbumUseCase(logger, repository, exceptionService)),
        },
      ],
      exports: [
        AlbumUsecasesProxyModule.GET_ALBUMS_USECASES_PROXY,
        AlbumUsecasesProxyModule.GET_ALBUM_USECASES_PROXY,
        AlbumUsecasesProxyModule.POST_ALBUM_USECASES_PROXY,
        AlbumUsecasesProxyModule.PUT_ALBUM_USECASES_PROXY,
        AlbumUsecasesProxyModule.DELETE_ALBUM_USECASES_PROXY,
      ],
    };
  }
}
