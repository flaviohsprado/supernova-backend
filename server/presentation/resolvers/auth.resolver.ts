import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginUseCase } from '../../domain/use-cases/auth/login.usecase';
import { AuthUsecasesProxyModule } from '../../infra/usecases-proxy/auth/auth-usecases-proxy.module';
import { UseCaseProxy } from '../../infra/usecases-proxy/usecase-proxy';
import { Public } from '../../main/decorators/isPublicRoute.decorator';
import { AuthDTO } from '../dtos/auth.dto';
import { AuthPresenter } from '../presenters/auth.presenter';

@Resolver()
export class AuthResolver {
	constructor(
		@Inject(AuthUsecasesProxyModule.LOGIN_USECASES_PROXY)
		private readonly loginUseCase: UseCaseProxy<LoginUseCase>,
	) {}

	@Mutation((returns) => AuthPresenter)
	@Public()
	public async login(
		@Args('authCredentials') authCredentials: AuthDTO,
	): Promise<AuthPresenter> {
		const credentials = new AuthDTO(authCredentials);
		return this.loginUseCase.getInstance().execute(credentials);
	}
}
