import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUseCase } from '../../../domain/use-cases/auth/login.usecase';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { LoggerService } from '../../logger/logger.service';
import { AuthUsecasesProxyModule } from '../../usecases-proxy/auth/auth-usecases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';

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
			usernameField: 'email',
		});
	}

	public async validate(email: string, password: string): Promise<any> {
		if (!email || !password) {
			this.logger.warn(
				'LocalStrategy',
				`Email or password is missing, BadRequestException`,
			);
			this.exceptionService.throwUnauthorizedException();
		}

		const user = await this.loginUsecaseProxy
			.getInstance()
			.execute({ email, password });

		if (!user) {
			this.logger.warn('LocalStrategy', `Invalid email or password`);

			this.exceptionService.throwUnauthorizedException({
				message: 'Invalid email or password.',
			});
		}

		return user;
	}
}
