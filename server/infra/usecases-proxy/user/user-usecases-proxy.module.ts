import { BcryptService } from '../../services/bcrypt/bcrypt.service';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { DynamicModule, Module } from '@nestjs/common';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUserUseCase,
  FindOneUserUseCase,
  FindUserByKeyUseCase,
  UpdateUserUseCase,
} from '../../../domain/use-cases/user';
import { UseCaseProxy } from '../usecase-proxy';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { DatabaseUserRepository } from '../../repositories/user.repository';
import { ExceptionsModule } from '../../exceptions/exceptions.module';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { CacheConfigModule } from '../../config/redis/cache.module';
import { CacheService } from '../../config/redis/cache.service';

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    BcryptModule,
    ExceptionsModule,
    CacheConfigModule,
  ],
})
export class UserUsecasesProxyModule {
  static GET_USER_USECASES_PROXY = 'getUserUsecasesProxy';
  static GET_USERS_USECASES_PROXY = 'getUsersUsecasesProxy';
  static FIND_USER_BY_KEY_USECASES_PROXY = 'findUserByKeyUsecasesProxy';
  static POST_USER_USECASES_PROXY = 'postUserUsecasesProxy';
  static DELETE_USER_USECASES_PROXY = 'deleteUserUsecasesProxy';
  static PUT_USER_USECASES_PROXY = 'putUserUsecasesProxy';

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
          inject: [LoggerService, DatabaseUserRepository, BcryptService],
          provide: UserUsecasesProxyModule.POST_USER_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: DatabaseUserRepository,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new CreateUserUseCase(logger, repository, bcryptService),
            ),
        },
        {
          inject: [LoggerService, DatabaseUserRepository, BcryptService],
          provide: UserUsecasesProxyModule.PUT_USER_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: DatabaseUserRepository,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new UpdateUserUseCase(logger, repository, bcryptService),
            ),
        },
        {
          inject: [LoggerService, DatabaseUserRepository],
          provide: UserUsecasesProxyModule.DELETE_USER_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: DatabaseUserRepository,
          ) => new UseCaseProxy(new DeleteUserUseCase(logger, repository)),
        },
      ],
      exports: [
        UserUsecasesProxyModule.GET_USERS_USECASES_PROXY,
        UserUsecasesProxyModule.GET_USER_USECASES_PROXY,
        UserUsecasesProxyModule.FIND_USER_BY_KEY_USECASES_PROXY,
        UserUsecasesProxyModule.POST_USER_USECASES_PROXY,
        UserUsecasesProxyModule.PUT_USER_USECASES_PROXY,
        UserUsecasesProxyModule.DELETE_USER_USECASES_PROXY,
      ],
    };
  }
}
