import { HttpCode, Inject } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { IAuth } from 'server/domain/interfaces/auth.interface';
import { GraphqlAuthGuard } from 'server/infra/commons/guards/graphql-jwt-auth.guard';
import { FileUtils } from 'server/infra/commons/utils/file.utils';
import { CurrentUser } from 'server/main/decorators/currentUser.decorator';
import { Public } from 'server/main/decorators/isPublicRoute.decorator';
import { User } from '../../../domain/entities/user.entity';
import {
	CreateUserUseCase,
	DeleteUserUseCase,
	FindAllUserUseCase,
	FindOneUserUseCase,
	UpdateUserFileUseCase,
	UpdateUserUseCase,
} from '../../../domain/use-cases/user';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { UserUsecasesProxyModule } from '../../usecases-proxy/user/user-usecases-proxy.module';
import { CreateFileDTO } from '../file/file.dto';
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
		@Inject(UserUsecasesProxyModule.PUT_USER_FILE_USECASES_PROXY)
		private readonly updateUserFileUseCase: UseCaseProxy<UpdateUserFileUseCase>,
		@Inject(UserUsecasesProxyModule.DELETE_USER_USECASES_PROXY)
		private readonly deleteUserUseCase: UseCaseProxy<DeleteUserUseCase>,
	) {}

	@Query((returns) => User)
	@UseGuards(GraphqlAuthGuard)
	public async findUser(@CurrentUser() user: IAuth): Promise<UserPresenter> {
		return await this.findOneUserUseCase.getInstance().execute(user.id);
	}

	@Query((returns) => [User])
	public async findAllUser(): Promise<UserPresenter[]> {
		const users = await this.findAllUserUseCase.getInstance().execute();
		return users.map((user) => new UserPresenter(user));
	}

	@Query((returns) => User)
	public async findOneUser(@Args('id') id: string): Promise<UserPresenter> {
		return await this.findOneUserUseCase.getInstance().execute(id);
	}

	@Mutation((returns) => UserPresenter)
	@Public()
	public async createUser(
		@Args('user') user: CreateUserDTO,
		@Args('file', { type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
	): Promise<UserPresenter> {
		const newFile: CreateFileDTO = await FileUtils.createFile(file);
		const newUSer: CreateUserDTO = new CreateUserDTO(user);
		return await this.createUserUseCase.getInstance().execute(newUSer, newFile);
	}

	@Mutation((returns) => User)
	public async updateUser(
		@Args('id') id: string,
		@Args('user', { nullable: true }) user: UpdateUserDTO,
	): Promise<UserPresenter> {
		return await this.updateUserUseCase.getInstance().execute(id, user);
	}

	@Mutation((returns) => User)
	public async updateUserFile(
		@Args('id') id: string,
		@Args('file', { type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
	): Promise<UserPresenter> {
		const newFile: CreateFileDTO = await FileUtils.createFile(file);
		return await this.updateUserFileUseCase.getInstance().execute(id, newFile);
	}

	@HttpCode(204)
	@Mutation((returns) => User)
	public async deleteUser(@Args('id') id: string): Promise<User> {
		return await this.deleteUserUseCase.getInstance().execute(id);
	}
}
