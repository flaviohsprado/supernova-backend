import { DynamicModule, Module } from '@nestjs/common';
import { InsertMusicPlaylistUseCase } from 'server/domain/use-cases/playlist/insert-music-playlist.usecase';
import { DatabaseMusicRepository } from 'server/infra/repositories/music.repository';
import {
	CreatePlaylistUseCase,
	DeleteMusicPlaylistUseCase,
	DeletePlaylistUseCase,
	FindAllPlaylistUseCase,
	FindOnePlaylistUseCase,
	UpdatePlaylistUseCase,
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

	static register(): DynamicModule {
		return {
			module: PlaylistUsecasesProxyModule,
			providers: [
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
				{
					inject: [LoggerService, DatabasePlaylistRepository],
					provide: PlaylistUsecasesProxyModule.POST_PLAYLIST_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabasePlaylistRepository,
					) => new UseCaseProxy(new CreatePlaylistUseCase(logger, repository)),
				},
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
						ExceptionsService,
					],
					provide: PlaylistUsecasesProxyModule.DELETE_PLAYLIST_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabasePlaylistRepository,
						exceptionService: ExceptionsService,
					) =>
						new UseCaseProxy(
							new DeletePlaylistUseCase(logger, repository, exceptionService),
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
			],
		};
	}
}
