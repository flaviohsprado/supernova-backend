import { LoginUseCase } from '../../../domain/use-cases/auth/login.usecase';
import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from '../usecase-proxy';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { DatabaseUserRepository } from '../../repositories/user.repository';
import { ExceptionsModule } from '../../exceptions/exceptions.module';
import { JwtTokenService } from '../../services/jwt/jwt.service';
import { BcryptService } from '../../services/bcrypt/bcrypt.service';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { JwtModule } from '../../services/jwt/jwt.module';

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    BcryptModule,
    JwtModule,
  ],
})
export class AuthUsecasesProxyModule {
  static LOGIN_USECASES_PROXY = 'loginUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: AuthUsecasesProxyModule,
      providers: [
        {
          inject: [
            LoggerService,
            JwtTokenService,
            BcryptService,
            ExceptionsService,
            DatabaseUserRepository,
          ],
          provide: AuthUsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtService: JwtTokenService,
            bcryptService: BcryptService,
            exceptionService: ExceptionsService,
            userRepository: DatabaseUserRepository,
          ) =>
            new UseCaseProxy(
              new LoginUseCase(
                logger,
                jwtService,
                bcryptService,
                exceptionService,
                userRepository,
              ),
            ),
        },
      ],
      exports: [AuthUsecasesProxyModule.LOGIN_USECASES_PROXY],
    };
  }
}
