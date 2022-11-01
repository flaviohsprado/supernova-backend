import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { LoginUseCase } from '../../../domain/use-cases/auth/login.usecase';
import { AuthUsecasesProxyModule } from '../../usecases-proxy/auth/auth-usecases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { AuthDTO } from './auth.dto';
import { AuthPresenter } from './auth.presenter';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(AuthUsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCase: UseCaseProxy<LoginUseCase>,
  ) {}

  @Mutation((returns) => AuthPresenter)
  async login(
    @Args('authCredentials') authCredentials: AuthDTO,
  ): Promise<AuthPresenter> {
    const credentials = new AuthDTO(authCredentials);
    return this.loginUseCase.getInstance().execute(credentials);
  }
}
