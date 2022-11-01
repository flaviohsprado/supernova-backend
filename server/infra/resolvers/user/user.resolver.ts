import { HttpCode, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../../domain/entities/user.entity';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUserUseCase,
  FindOneUserUseCase,
  UpdateUserUseCase
} from '../../../domain/use-cases/user';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { UserUsecasesProxyModule } from '../../usecases-proxy/user/user-usecases-proxy.module';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { UserPresenter } from './user.presenter';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    @Inject(UserUsecasesProxyModule.GET_USERS_USECASES_PROXY)
    private readonly findAllUserUseCase: UseCaseProxy<FindAllUserUseCase>,
    @Inject(UserUsecasesProxyModule.GET_USER_USECASES_PROXY)
    private readonly findOneUserUseCase: UseCaseProxy<FindOneUserUseCase>,
    @Inject(UserUsecasesProxyModule.POST_USER_USECASES_PROXY)
    private readonly createUserUseCase: UseCaseProxy<CreateUserUseCase>,
    @Inject(UserUsecasesProxyModule.PUT_USER_USECASES_PROXY)
    private readonly updateUserUseCase: UseCaseProxy<UpdateUserUseCase>,
    @Inject(UserUsecasesProxyModule.DELETE_USER_USECASES_PROXY)
    private readonly deleteUserUseCase: UseCaseProxy<DeleteUserUseCase>,
  ) {}

  @Query((returns) => [User])
  public async findAll(): Promise<UserPresenter[]> {
    const users = await this.findAllUserUseCase.getInstance().execute();
    return users.map((user) => new UserPresenter(user));
  }

  @Query((returns) => User)
  public async findOne(@Args('id') id: string): Promise<UserPresenter> {
    return await this.findOneUserUseCase.getInstance().execute(id);
  }

  @Mutation((returns) => UserPresenter)
  public async create(
    @Args('user') user: CreateUserDTO,
  ): Promise<UserPresenter> {
    return await this.createUserUseCase.getInstance().execute(user);
  }

  @Mutation((returns) => User)
  public async update(
    @Args('id') id: string,
    @Args('user') user: UpdateUserDTO,
  ): Promise<UserPresenter> {
    return await this.updateUserUseCase.getInstance().execute(id, user);
  }

  @HttpCode(204)
  @Mutation((returns) => User)
  public async delete(@Args('id') id: string): Promise<User> {
    return await this.deleteUserUseCase.getInstance().execute(id);
  }
}
