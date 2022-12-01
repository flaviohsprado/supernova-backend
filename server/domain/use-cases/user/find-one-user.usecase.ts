import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository';
import { IExceptionService } from '../../interfaces/exceptions.interface';
import { ICacheManager } from '../../interfaces/cache.interface';

export class FindOneUserUseCase {
	constructor(
		private readonly repository: IUserRepository,
		private readonly exceptionService: IExceptionService,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(id: string): Promise<User> {
		const cachedUser = await this.cacheManager.getCachedObject<User>('user');

		if (cachedUser) return cachedUser;

		const user: User = await this.repository.findOne(id);

		if (!user)
			this.exceptionService.throwNotFoundException({
				message: 'User not found',
			});

		await this.cacheManager.setObjectInCache('user', user);

		return user;
	}
}
