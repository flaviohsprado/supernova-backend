import { ICacheManager } from '../../../main/interfaces/cache.interface';
import { IUserRepository } from '../../abstracts/repositories/user.repository';
import { User } from '../../entities/user.entity';

export class FindAllUserUseCase {
	constructor(
		private readonly repository: IUserRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(): Promise<User[]> {
		const cachedUsers = await this.cacheManager.getCachedObject<User[]>(
			'users',
		);

		if (cachedUsers) return cachedUsers;

		const users = await this.repository.findAll();

		await this.cacheManager.setObjectInCache('users', users);

		return users;
	}
}
