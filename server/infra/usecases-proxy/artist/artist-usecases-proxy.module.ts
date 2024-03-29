import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseArtistRepository } from '../../../data/repositories/artist.repository';
import { RepositoriesModule } from '../../../data/repositories/repositories.module';
import {
	CreateArtistUseCase,
	DeleteArtistUseCase,
	FindAllArtistUseCase,
	FindOneArtistUseCase,
	UpdateArtistUseCase,
} from '../../../domain/use-cases/artist';
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
	],
})
export class ArtistUsecasesProxyModule {
	static GET_ARTIST_USECASES_PROXY = 'getArtistUsecasesProxy';
	static GET_ARTISTS_USECASES_PROXY = 'getArtistsUsecasesProxy';
	static POST_ARTIST_USECASES_PROXY = 'postArtistUsecasesProxy';
	static DELETE_ARTIST_USECASES_PROXY = 'deleteArtistUsecasesProxy';
	static PUT_ARTIST_USECASES_PROXY = 'putArtistUsecasesProxy';

	static register(): DynamicModule {
		return {
			module: ArtistUsecasesProxyModule,
			providers: [
				{
					inject: [DatabaseArtistRepository, CacheService],
					provide: ArtistUsecasesProxyModule.GET_ARTISTS_USECASES_PROXY,
					useFactory: (
						repository: DatabaseArtistRepository,
						cacheService: CacheService,
					) =>
						new UseCaseProxy(
							new FindAllArtistUseCase(repository, cacheService),
						),
				},
				{
					inject: [DatabaseArtistRepository, CacheService],
					provide: ArtistUsecasesProxyModule.GET_ARTIST_USECASES_PROXY,
					useFactory: (
						repository: DatabaseArtistRepository,
						cacheService: CacheService,
					) =>
						new UseCaseProxy(
							new FindOneArtistUseCase(repository, cacheService),
						),
				},
				{
					inject: [LoggerService, DatabaseArtistRepository],
					provide: ArtistUsecasesProxyModule.POST_ARTIST_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseArtistRepository,
					) => new UseCaseProxy(new CreateArtistUseCase(logger, repository)),
				},
				{
					inject: [LoggerService, DatabaseArtistRepository],
					provide: ArtistUsecasesProxyModule.PUT_ARTIST_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseArtistRepository,
					) => new UseCaseProxy(new UpdateArtistUseCase(logger, repository)),
				},
				{
					inject: [LoggerService, DatabaseArtistRepository],
					provide: ArtistUsecasesProxyModule.DELETE_ARTIST_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseArtistRepository,
					) => new UseCaseProxy(new DeleteArtistUseCase(logger, repository)),
				},
			],
			exports: [
				ArtistUsecasesProxyModule.GET_ARTISTS_USECASES_PROXY,
				ArtistUsecasesProxyModule.GET_ARTIST_USECASES_PROXY,
				ArtistUsecasesProxyModule.POST_ARTIST_USECASES_PROXY,
				ArtistUsecasesProxyModule.PUT_ARTIST_USECASES_PROXY,
				ArtistUsecasesProxyModule.DELETE_ARTIST_USECASES_PROXY,
			],
		};
	}
}
