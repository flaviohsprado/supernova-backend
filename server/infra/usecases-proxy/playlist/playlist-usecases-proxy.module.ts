import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { DatabaseFileRepository } from 'server/infra/repositories/file.repository';
import { DatabaseMusicRepository } from 'server/infra/repositories/music.repository';
import { S3ConfigModule } from 'server/infra/services/s3/s3.module';
import { S3Service } from 'server/infra/services/s3/s3.service';
import {
	CreatePlaylistUseCase,
	DeleteMusicPlaylistUseCase,
	DeletePlaylistUseCase,
	FindAllPlaylistUseCase,
	FindOnePlaylistUseCase,
	InsertMusicPlaylistUseCase,
	UpdatePlaylistFileUseCase,
	UpdatePlaylistUseCase
} from '../../../domain/use-cases/playlist';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { CacheConfigModule } from '../../config/redis/cache.module';
import { CacheService } from '../../config/redis/cache.service';
import { ExceptionsModule } from '../../exceptions/exceptions.module';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';
import { DatabasePlaylistRepository } from '../../repositories/playlist.repository';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecase-proxy';

@Module({
	imports: [
		LoggerModule,
		EnvironmentConfigModule,
		RepositoriesModule,
		ExceptionsModule,
		CacheConfigModule,
		S3ConfigModule,
	],
})
export class PlaylistUsecasesProxyModule {
	static GET_PLAYLIST_USECASES_PROXY = 'getPlaylistUsecasesProxy';
	static GET_PLAYLISTS_USECASES_PROXY = 'getPlaylistsUsecasesProxy';
	static POST_PLAYLIST_USECASES_PROXY = 'postPlaylistUsecasesProxy';
	static DELETE_PLAYLIST_USECASES_PROXY = 'deletePlaylistUsecasesProxy';
	static PUT_PLAYLIST_USECASES_PROXY = 'putPlaylistUsecasesProxy';
	static INSERT_MUSIC_PLAYLIST_USECASES_PROXY =
		'insertMusicPlaylistUsecasesProxy';
	static DELETE_MUSIC_PLAYLIST_USECASES_PROXY =
		'deleteMusicPlaylistUsecasesProxy';
	static PUT_PLAYLIST_FILE_USECASES_PROXY = 'putFilePlaylistUsecasesProxy';

	static register(): DynamicModule {
		return {
			module: PlaylistUsecasesProxyModule,
			providers: [
				//GET_PLAYLISTS_USECASES_PROXY
				{
					inject: [DatabasePlaylistRepository, CacheService],
					provide: PlaylistUsecasesProxyModule.GET_PLAYLISTS_USECASES_PROXY,
					useFactory: (
						repository: DatabasePlaylistRepository,
						cacheService: CacheService,
					) =>
						new UseCaseProxy(
							new FindAllPlaylistUseCase(repository, cacheService),
						),
				},
				//GET_PLAYLIST_USECASES_PROXY
				{
					inject: [DatabasePlaylistRepository, ExceptionsService, CacheService],
					provide: PlaylistUsecasesProxyModule.GET_PLAYLIST_USECASES_PROXY,
					useFactory: (
						repository: DatabasePlaylistRepository,
						exceptionService: ExceptionsService,
						cacheService: CacheService,
					) =>
						new UseCaseProxy(
							new FindOnePlaylistUseCase(
								repository,
								exceptionService,
								cacheService,
							),
						),
				},
				//INSERT_MUSIC_PLAYLIST_USECASES_PROXY
				{
					inject: [
						LoggerService,
						DatabasePlaylistRepository,
						DatabaseMusicRepository,
					],
					provide:
						PlaylistUsecasesProxyModule.INSERT_MUSIC_PLAYLIST_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabasePlaylistRepository,
						musicRepository: DatabaseMusicRepository,
					) =>
						new UseCaseProxy(
							new InsertMusicPlaylistUseCase(
								logger,
								repository,
								musicRepository,
							),
						),
				},
				//DELETE_MUSIC_PLAYLIST_USECASES_PROXY
				{
					inject: [
						LoggerService,
						DatabasePlaylistRepository,
						DatabaseMusicRepository,
					],
					provide:
						PlaylistUsecasesProxyModule.DELETE_MUSIC_PLAYLIST_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabasePlaylistRepository,
						musicRepository: DatabaseMusicRepository,
					) =>
						new UseCaseProxy(
							new DeleteMusicPlaylistUseCase(
								logger,
								repository,
								musicRepository,
							),
						),
				},
				//POST_PLAYLIST_USECASES_PROXY
				{
					inject: [
						LoggerService,
						DatabasePlaylistRepository,
						DatabaseFileRepository,
						S3Service,
						EnvironmentConfigService,
					],
					provide: PlaylistUsecasesProxyModule.POST_PLAYLIST_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabasePlaylistRepository,
						fileRepository: DatabaseFileRepository,
						s3Service: S3Service,
						config: EnvironmentConfigService,
					) =>
						new UseCaseProxy(
							new CreatePlaylistUseCase(
								logger,
								repository,
								fileRepository,
								s3Service,
								config,
							),
						),
				},
				//PUT_PLAYLIST_USECASES_PROXY
				{
					inject: [LoggerService, DatabasePlaylistRepository],
					provide: PlaylistUsecasesProxyModule.PUT_PLAYLIST_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabasePlaylistRepository,
					) => new UseCaseProxy(new UpdatePlaylistUseCase(logger, repository)),
				},
				{
					inject: [
						LoggerService,
						DatabasePlaylistRepository,
						DatabaseFileRepository,
						S3Service,
						EnvironmentConfigService,
					],
					provide: PlaylistUsecasesProxyModule.PUT_PLAYLIST_FILE_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabasePlaylistRepository,
						fileRepository: DatabaseFileRepository,
						s3Service: S3Service,
						config: EnvironmentConfigService,
					) =>
						new UseCaseProxy(
							new UpdatePlaylistFileUseCase(
								logger,
								repository,
								fileRepository,
								s3Service,
								config,
							),
						),
				},
				//DELETE_PLAYLIST_USECASES_PROXY
				{
					inject: [
						LoggerService,
						DatabasePlaylistRepository,
						ExceptionsService,
						S3Service,
						EnvironmentConfigService,
						DatabaseFileRepository,
					],
					provide: PlaylistUsecasesProxyModule.DELETE_PLAYLIST_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabasePlaylistRepository,
						exceptionService: ExceptionsService,
						s3Service: S3Service,
						config: EnvironmentConfigService,
						fileRepository: DatabaseFileRepository,
					) =>
						new UseCaseProxy(
							new DeletePlaylistUseCase(
								logger,
								repository,
								exceptionService,
								fileRepository,
								s3Service,
								config,
							),
						),
				},
			],
			exports: [
				PlaylistUsecasesProxyModule.GET_PLAYLISTS_USECASES_PROXY,
				PlaylistUsecasesProxyModule.GET_PLAYLIST_USECASES_PROXY,
				PlaylistUsecasesProxyModule.POST_PLAYLIST_USECASES_PROXY,
				PlaylistUsecasesProxyModule.INSERT_MUSIC_PLAYLIST_USECASES_PROXY,
				PlaylistUsecasesProxyModule.DELETE_MUSIC_PLAYLIST_USECASES_PROXY,
				PlaylistUsecasesProxyModule.PUT_PLAYLIST_USECASES_PROXY,
				PlaylistUsecasesProxyModule.DELETE_PLAYLIST_USECASES_PROXY,
				PlaylistUsecasesProxyModule.PUT_PLAYLIST_FILE_USECASES_PROXY,
			],
		};
	}
}
