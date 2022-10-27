import { DynamicModule, Module } from '@nestjs/common';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUserUseCase,
  FindOneUserUseCase,
  UpdateUserUseCase,
} from '../../../domain/use-cases/user/index';
import { UseCaseProxy } from '../usecase-proxy';
import { EnvironmentConfigModule } from './../../config/environment-config/environment-config.module';
import { LoggerModule } from './../../logger/logger.module';
import { LoggerService } from './../../logger/logger.service';
import { RepositoriesModule } from './../../repositories/repositories.module';
import { DatabaseUserRepository } from './../../repositories/user.repository';

@Module({
  imports: [LoggerModule, EnvironmentConfigModule, RepositoriesModule],
})
export class UserUsecasesProxyModule {
  static GET_USER_USECASES_PROXY = 'getUserUsecasesProxy';
  static GET_USERS_USECASES_PROXY = 'getUsersUsecasesProxy';
  static POST_USER_USECASES_PROXY = 'postUserUsecasesProxy';
  static DELETE_USER_USECASES_PROXY = 'deleteUserUsecasesProxy';
  static PUT_USER_USECASES_PROXY = 'putUserUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UserUsecasesProxyModule,
      providers: [
        {
          inject: [DatabaseUserRepository],
          provide: UserUsecasesProxyModule.GET_USER_USECASES_PROXY,
          useFactory: (repository: DatabaseUserRepository) =>
            new UseCaseProxy(new FindOneUserUseCase(repository)),
        },
        {
          inject: [DatabaseUserRepository],
          provide: UserUsecasesProxyModule.GET_USERS_USECASES_PROXY,
          useFactory: (repository: DatabaseUserRepository) =>
            new UseCaseProxy(new FindAllUserUseCase(repository)),
        },
        {
          inject: [LoggerService, DatabaseUserRepository],
          provide: UserUsecasesProxyModule.POST_USER_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: DatabaseUserRepository,
          ) => new UseCaseProxy(new CreateUserUseCase(logger, repository)),
        },
        {
          inject: [LoggerService, DatabaseUserRepository],
          provide: UserUsecasesProxyModule.PUT_USER_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            repository: DatabaseUserRepository,
          ) => new UseCaseProxy(new UpdateUserUseCase(logger, repository)),
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
        UserUsecasesProxyModule.GET_USER_USECASES_PROXY,
        UserUsecasesProxyModule.GET_USERS_USECASES_PROXY,
        UserUsecasesProxyModule.POST_USER_USECASES_PROXY,
        UserUsecasesProxyModule.PUT_USER_USECASES_PROXY,
        UserUsecasesProxyModule.DELETE_USER_USECASES_PROXY,
      ],
    };
  }
}
