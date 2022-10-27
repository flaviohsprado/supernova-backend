import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {Inject, UseGuards} from '@nestjs/common';
import {LoginUseCase} from '../../../domain/use-cases/auth/login.usecase';
import {AuthUsecasesProxyModule} from '../../usecases-proxy/auth/auth-usecases-proxy.module';
import {UseCaseProxy} from '../../usecases-proxy/usecase-proxy';
import {AuthDTO} from './auth.dto';
import {AuthPresenter} from './auth.presenter';
import {GqlAuthGuard} from "../../commons/guards/graphql-jwt-auth.guard";

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(AuthUsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCase: UseCaseProxy<LoginUseCase>,
  ) {}

  @Mutation((returns) => AuthPresenter)
  @UseGuards(GqlAuthGuard)
  async login(@Args('authCredentials') authCredentials: AuthDTO) {
    const credentials = new AuthDTO(authCredentials);
    return this.loginUseCase.getInstance().execute(credentials);
  }
}
