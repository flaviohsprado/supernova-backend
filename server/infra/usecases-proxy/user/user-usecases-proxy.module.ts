import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { DatabaseFileRepository } from 'server/infra/repositories/file.repository';
import { JwtModule } from 'server/infra/services/jwt/jwt.module';
import { JwtTokenService } from 'server/infra/services/jwt/jwt.service';
import { S3ConfigModule } from 'server/infra/services/s3/s3.module';
import { S3Service } from 'server/infra/services/s3/s3.service';
import {
	CreateUserUseCase,
	DeleteUserUseCase,
	FindAllUserUseCase,
	FindOneUserUseCase,
	FindUserByKeyUseCase,
	UpdateUserFileUseCase,
	UpdateUserUseCase,
} from '../../../domain/use-cases/user';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { CacheConfigModule } from '../../config/redis/cache.module';
import { CacheService } from '../../config/redis/cache.service';
import { ExceptionsModule } from '../../exceptions/exceptions.module';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { DatabaseUserRepository } from '../../repositories/user.repository';
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
export class UserUsecasesProxyModule {
	static GET_USER_USECASES_PROXY = 'getUserUsecasesProxy';
	static GET_USERS_USECASES_PROXY = 'getUsersUsecasesProxy';
	static FIND_USER_BY_KEY_USECASES_PROXY = 'findUserByKeyUsecasesProxy';
	static POST_USER_USECASES_PROXY = 'postUserUsecasesProxy';
	static PUT_USER_USECASES_PROXY = 'putUserUsecasesProxy';
	static PUT_USER_FILE_USECASES_PROXY = 'putUserFileUsecasesProxy';
	static DELETE_USER_USECASES_PROXY = 'deleteUserUsecasesProxy';

	static register(): DynamicModule {
		return {
			module: UserUsecasesProxyModule,
			providers: [
				{
					inject: [DatabaseUserRepository, CacheService],
					provide: UserUsecasesProxyModule.GET_USERS_USECASES_PROXY,
					useFactory: (
						repository: DatabaseUserRepository,
						cacheService: CacheService,
					) =>
						new UseCaseProxy(new FindAllUserUseCase(repository, cacheService)),
				},
				{
					inject: [DatabaseUserRepository, ExceptionsService, CacheService],
					provide: UserUsecasesProxyModule.GET_USER_USECASES_PROXY,
					useFactory: (
						repository: DatabaseUserRepository,
						exceptionService: ExceptionsService,
						cacheService: CacheService,
					) =>
						new UseCaseProxy(
							new FindOneUserUseCase(
								repository,
								exceptionService,
								cacheService,
							),
						),
				},
				{
					inject: [DatabaseUserRepository, ExceptionsService, CacheService],
					provide: UserUsecasesProxyModule.FIND_USER_BY_KEY_USECASES_PROXY,
					useFactory: (
						repository: DatabaseUserRepository,
						exceptionService: ExceptionsService,
						cacheService: CacheService,
					) =>
						new UseCaseProxy(
							new FindUserByKeyUseCase(
								repository,
								exceptionService,
								cacheService,
							),
						),
				},
				{
					inject: [
						LoggerService,
						DatabaseUserRepository,
						DatabaseFileRepository,
						BcryptService,
						JwtTokenService,
						ExceptionsService,
						S3Service,
						EnvironmentConfigService,
					],
					provide: UserUsecasesProxyModule.POST_USER_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseUserRepository,
						fileRepository: DatabaseFileRepository,
						bcryptService: BcryptService,
						jwtService: JwtTokenService,
						exceptionService: ExceptionsService,
						s3Service: S3Service,
						config: EnvironmentConfigService,
					) =>
						new UseCaseProxy(
							new CreateUserUseCase(
								logger,
								repository,
								fileRepository,
								bcryptService,
								jwtService,
								exceptionService,
								s3Service,
								config,
							),
						),
				},
				{
					inject: [
						LoggerService,
						DatabaseUserRepository,
						BcryptService,
						ExceptionsService,
					],
					provide: UserUsecasesProxyModule.PUT_USER_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseUserRepository,
						bcryptService: BcryptService,
						exceptionService: ExceptionsService,
					) =>
						new UseCaseProxy(
							new UpdateUserUseCase(
								logger,
								repository,
								bcryptService,
								exceptionService,
							),
						),
				},
				{
					inject: [
						LoggerService,
						DatabaseUserRepository,
						DatabaseFileRepository,
						S3Service,
						EnvironmentConfigService,
					],
					provide: UserUsecasesProxyModule.PUT_USER_FILE_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseUserRepository,
						fileRepository: DatabaseFileRepository,
						s3Service: S3Service,
						config: EnvironmentConfigService,
					) =>
						new UseCaseProxy(
							new UpdateUserFileUseCase(
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
						DatabaseUserRepository,
						ExceptionsService,
						S3Service,
						EnvironmentConfigService,
						DatabaseFileRepository,
					],
					provide: UserUsecasesProxyModule.DELETE_USER_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						repository: DatabaseUserRepository,
						exceptionService: ExceptionsService,
						s3Service: S3Service,
						config: EnvironmentConfigService,
						fileRepository: DatabaseFileRepository,
					) =>
						new UseCaseProxy(
							new DeleteUserUseCase(
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
				UserUsecasesProxyModule.GET_USERS_USECASES_PROXY,
				UserUsecasesProxyModule.GET_USER_USECASES_PROXY,
				UserUsecasesProxyModule.FIND_USER_BY_KEY_USECASES_PROXY,
				UserUsecasesProxyModule.POST_USER_USECASES_PROXY,
				UserUsecasesProxyModule.PUT_USER_USECASES_PROXY,
				UserUsecasesProxyModule.PUT_USER_FILE_USECASES_PROXY,
				UserUsecasesProxyModule.DELETE_USER_USECASES_PROXY,
			],
		};
	}
}
