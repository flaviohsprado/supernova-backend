import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUseCase } from '../../../domain/use-cases/auth/login.usecase';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { AuthUsecasesProxyModule } from '../../usecases-proxy/auth/auth-usecases-proxy.module';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(AuthUsecasesProxyModule.LOGIN_USECASES_PROXY)
		private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCase>,
		private readonly logger: LoggerService,
		private readonly exceptionService: ExceptionsService,
	) {
		//the passport-local strategy by default expects properties called
		//username and password in the request body: 'Missing credentials error'
		super({
			passReqToCallback: true,
		});
	}

	public async validate(username: string, password: string): Promise<any> {
		if (!username || !password) {
			this.logger.warn(
				'LocalStrategy',
				`Username or password is missing, BadRequestException`,
			);
			this.exceptionService.throwUnauthorizedException();
		}

		const user = await this.loginUsecaseProxy
			.getInstance()
			.execute({ username, password });

		if (!user) {
			this.logger.warn('LocalStrategy', `Invalid username or password`);

			this.exceptionService.throwUnauthorizedException({
				message: 'Invalid username or password.',
			});
		}

		return user;
	}
}
