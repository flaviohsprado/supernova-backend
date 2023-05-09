import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../../data/repositories/repositories.module';
import { DatabaseUserRepository } from '../../../data/repositories/user.repository';
import { LoginUseCase } from '../../../domain/use-cases/auth/login.usecase';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { LoggerModule } from '../../logger/logger.module';
import { LoggerService } from '../../logger/logger.service';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { BcryptService } from '../../services/bcrypt/bcrypt.service';
import { JwtModule } from '../../services/jwt/jwt.module';
import { JwtTokenService } from '../../services/jwt/jwt.service';
import { UseCaseProxy } from '../usecase-proxy';

@Module({
	imports: [
		LoggerModule,
		EnvironmentConfigModule,
		RepositoriesModule,
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
						DatabaseUserRepository,
					],
					provide: AuthUsecasesProxyModule.LOGIN_USECASES_PROXY,
					useFactory: (
						logger: LoggerService,
						jwtService: JwtTokenService,
						bcryptService: BcryptService,
						userRepository: DatabaseUserRepository,
					) =>
						new UseCaseProxy(
							new LoginUseCase(
								logger,
								jwtService,
								bcryptService,
								userRepository,
							),
						),
				},
			],
			exports: [AuthUsecasesProxyModule.LOGIN_USECASES_PROXY],
		};
	}
}
