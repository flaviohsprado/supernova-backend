import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'server/main/decorators/isPublicRoute.decorator';
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
  @Public()
  public async login(
    @Args('authCredentials') authCredentials: AuthDTO,
  ): Promise<AuthPresenter> {
    const credentials = new AuthDTO(authCredentials);
    return this.loginUseCase.getInstance().execute(credentials);
  }
}
