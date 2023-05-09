import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseAlbumRepository } from '../../../data/repositories/album.repository';
import { DatabaseFileRepository } from '../../../data/repositories/file.repository';
import { RepositoriesModule } from '../../../data/repositories/repositories.module';
import {
	CreateAlbumUseCase,
	DeleteAlbumUseCase,
	FindAllAlbumUseCase,
	FindOneAlbumUseCase,
	UpdateAlbumFileUseCase,
	UpdateAlbumUseCase,
} from '../../../domain/use-cases/album';
import { EnvironmentConfigService } from '../../../infra/config/environment-config/environment-config.service';
import { S3ConfigModule } from '../../../infra/services/s3/s3.module';
import { S3Service } from '../../../infra/services/s3/s3.service';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { CacheConfigModule } from '../../config/redis/cache.module';
import { CacheService } from '../../config/redis/cache.service';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';
import { UseCaseProxy } from '../usecase-proxy';

@Module({
	imports: [
		LoggerModule,
		EnvironmentConfigModule,
		RepositoriesModule,
		CacheConfigModule,
		S3ConfigModule,
	],
})
export class AlbumUsecasesProxyModule {
	static GET_ALBUM_USECASES_PROXY = 'getAlbumUsecasesProxy';
	static GET_ALBUMS_USECASES_PROXY = 'getAlbumsUsecasesProxy';
	static POST_ALBUM_USECASES_PROXY = 'postAlbumUsecasesProxy';
	static DELETE_ALBUM_USECASES_PROXY = 'deleteAlbumUsecasesProxy';
	static PUT_ALBUM_USECASES_PROXY = 'putAlbumUsecasesProxy';
	static PUT_ALBUM_FILE_USECASES_PROXY = 'putFileAlbumUsecasesProxy';

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
					inject: [DatabaseAlbumRepository, CacheService],
					provide: AlbumUsecasesProxyModule.GET_ALBUM_USECASES_PROXY,
					useFactory: (
						repository: DatabaseAlbumRepository,
						cacheService: CacheService,
					) =>
						new UseCaseProxy(new FindOneAlbumUseCase(repository, cacheService)),
				},
				{
					inject: [
						LoggerService,
						DatabaseAlbumRepository,
						DatabaseFileRepository,
						S3Service,
						EnvironmentConfigService,
					],
					provide: AlbumUsecasesProxyModule.POST_ALBUM_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseAlbumRepository,
						fileRepository: DatabaseFileRepository,
						s3Service: S3Service,
						config: EnvironmentConfigService,
					) =>
						new UseCaseProxy(
							new CreateAlbumUseCase(
								logger,
								repository,
								fileRepository,
								s3Service,
								config,
							),
						),
				},
				{
					inject: [LoggerService, DatabaseAlbumRepository],
					provide: AlbumUsecasesProxyModule.PUT_ALBUM_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseAlbumRepository,
					) => new UseCaseProxy(new UpdateAlbumUseCase(logger, repository)),
				},
				{
					inject: [
						LoggerService,
						DatabaseAlbumRepository,
						DatabaseFileRepository,
						S3Service,
						EnvironmentConfigService,
					],
					provide: AlbumUsecasesProxyModule.PUT_ALBUM_FILE_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseAlbumRepository,
						fileRepository: DatabaseFileRepository,
						s3Service: S3Service,
						config: EnvironmentConfigService,
					) =>
						new UseCaseProxy(
							new UpdateAlbumFileUseCase(
								logger,
								repository,
								fileRepository,
								s3Service,
								config,
							),
						),
				},
				{
					inject: [
						LoggerService,
						DatabaseAlbumRepository,
						S3Service,
						EnvironmentConfigService,
						DatabaseFileRepository,
					],
					provide: AlbumUsecasesProxyModule.DELETE_ALBUM_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseAlbumRepository,
						s3Service: S3Service,
						config: EnvironmentConfigService,
						fileRepository: DatabaseFileRepository,
					) =>
						new UseCaseProxy(
							new DeleteAlbumUseCase(
								logger,
								repository,
								s3Service,
								config,
								fileRepository,
							),
						),
				},
			],
			exports: [
				AlbumUsecasesProxyModule.GET_ALBUMS_USECASES_PROXY,
				AlbumUsecasesProxyModule.GET_ALBUM_USECASES_PROXY,
				AlbumUsecasesProxyModule.POST_ALBUM_USECASES_PROXY,
				AlbumUsecasesProxyModule.PUT_ALBUM_USECASES_PROXY,
				AlbumUsecasesProxyModule.DELETE_ALBUM_USECASES_PROXY,
				AlbumUsecasesProxyModule.PUT_ALBUM_FILE_USECASES_PROXY,
			],
		};
	}
}
