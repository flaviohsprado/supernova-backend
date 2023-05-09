import { NotFoundException } from '@nestjs/common';
import { ICacheManager } from '../../../main/interfaces/cache.interface';
import { IUserRepository } from '../../abstracts/repositories/user.repository';
import { User } from '../../entities/user.entity';

export class FindUserByKeyUseCase {
	constructor(
		private readonly repository: IUserRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(key: string, value: string): Promise<User> {
		const cachedUser = await this.cacheManager.getCachedObject<User>(
			'userById',
		);

		if (cachedUser) return cachedUser;

		const user: User = await this.repository.findByKey(key, value);

		if (!user) throw new NotFoundException({ message: 'User not found' });

		await this.cacheManager.setObjectInCache('userById', user);

		return user;
	}
}
