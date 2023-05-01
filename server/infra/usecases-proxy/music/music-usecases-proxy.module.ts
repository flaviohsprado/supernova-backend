import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { DatabaseFileRepository } from 'server/infra/repositories/file.repository';
import { JwtModule } from 'server/infra/services/jwt/jwt.module';
import { S3ConfigModule } from 'server/infra/services/s3/s3.module';
import { S3Service } from 'server/infra/services/s3/s3.service';
import {
	CreateMusicUseCase,
	DeleteMusicUseCase,
	FindAllMusicUseCase,
	FindOneMusicUseCase,
	UpdateMusicFileUseCase,
	UpdateMusicUseCase,
} from '../../../domain/use-cases/music';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { CacheConfigModule } from '../../config/redis/cache.module';
import { CacheService } from '../../config/redis/cache.service';
import { ExceptionsModule } from '../../exceptions/exceptions.module';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';
import { DatabaseMusicRepository } from '../../repositories/music.repository';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { BcryptService } from '../../services/bcrypt/bcrypt.service';
import { UseCaseProxy } from '../usecase-proxy';

@Module({
	imports: [
		LoggerModule,
		EnvironmentConfigModule,
		RepositoriesModule,
		BcryptModule,
		ExceptionsModule,
		CacheConfigModule,
		JwtModule,
		S3ConfigModule,
	],
})
export class MusicUsecasesProxyModule {
	static GET_MUSIC_USECASES_PROXY = 'getMusicUsecasesProxy';
	static GET_MUSICS_USECASES_PROXY = 'getMusicsUsecasesProxy';
	static POST_MUSIC_USECASES_PROXY = 'postMusicUsecasesProxy';
	static PUT_MUSIC_USECASES_PROXY = 'putMusicUsecasesProxy';
	static PUT_MUSIC_FILE_USECASES_PROXY = 'putMusicFileUsecasesProxy';
	static DELETE_MUSIC_USECASES_PROXY = 'deleteMusicUsecasesProxy';

	static register(): DynamicModule {
		return {
			module: MusicUsecasesProxyModule,
			providers: [
				//GET
				{
					inject: [DatabaseMusicRepository, CacheService],
					provide: MusicUsecasesProxyModule.GET_MUSICS_USECASES_PROXY,
					useFactory: (
						repository: DatabaseMusicRepository,
						cacheService: CacheService,
					) =>
						new UseCaseProxy(new FindAllMusicUseCase(repository, cacheService)),
				},
				//GET
				{
					inject: [DatabaseMusicRepository, ExceptionsService, CacheService],
					provide: MusicUsecasesProxyModule.GET_MUSIC_USECASES_PROXY,
					useFactory: (
						repository: DatabaseMusicRepository,
						exceptionService: ExceptionsService,
						cacheService: CacheService,
					) =>
						new UseCaseProxy(
							new FindOneMusicUseCase(
								repository,
								exceptionService,
								cacheService,
							),
						),
				},
				//POST
				{
					inject: [
						LoggerService,
						DatabaseMusicRepository,
						DatabaseFileRepository,
						S3Service,
						EnvironmentConfigService,
					],
					provide: MusicUsecasesProxyModule.POST_MUSIC_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseMusicRepository,
						fileRepository: DatabaseFileRepository,
						s3Service: S3Service,
						environmentConfig: EnvironmentConfigService,
					) =>
						new UseCaseProxy(
							new CreateMusicUseCase(
								logger,
								repository,
								fileRepository,
								s3Service,
								environmentConfig,
							),
						),
				},
				//PUT
				{
					inject: [
						LoggerService,
						DatabaseMusicRepository,
						BcryptService,
						ExceptionsService,
					],
					provide: MusicUsecasesProxyModule.PUT_MUSIC_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseMusicRepository,
					) => new UseCaseProxy(new UpdateMusicUseCase(logger, repository)),
				},
				//PUT
				{
					inject: [
						LoggerService,
						DatabaseMusicRepository,
						DatabaseFileRepository,
						S3Service,
						EnvironmentConfigService,
					],
					provide: MusicUsecasesProxyModule.PUT_MUSIC_FILE_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseMusicRepository,
						fileRepository: DatabaseFileRepository,
						s3Service: S3Service,
						config: EnvironmentConfigService,
					) =>
						new UseCaseProxy(
							new UpdateMusicFileUseCase(
								logger,
								repository,
								fileRepository,
								s3Service,
								config,
							),
						),
				},
				//DELETE
				{
					inject: [
						LoggerService,
						DatabaseMusicRepository,
						ExceptionsService,
						S3Service,
						EnvironmentConfigService,
						DatabaseFileRepository,
					],
					provide: MusicUsecasesProxyModule.DELETE_MUSIC_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseMusicRepository,
						exceptionService: ExceptionsService,
						s3Service: S3Service,
						config: EnvironmentConfigService,
						fileRepository: DatabaseFileRepository,
					) =>
						new UseCaseProxy(
							new DeleteMusicUseCase(
								logger,
								repository,
								exceptionService,
								s3Service,
								config,
								fileRepository,
							),
						),
				},
			],
			exports: [
				MusicUsecasesProxyModule.GET_MUSICS_USECASES_PROXY,
				MusicUsecasesProxyModule.GET_MUSIC_USECASES_PROXY,
				MusicUsecasesProxyModule.POST_MUSIC_USECASES_PROXY,
				MusicUsecasesProxyModule.PUT_MUSIC_USECASES_PROXY,
				MusicUsecasesProxyModule.PUT_MUSIC_FILE_USECASES_PROXY,
				MusicUsecasesProxyModule.DELETE_MUSIC_USECASES_PROXY,
			],
		};
	}
}
