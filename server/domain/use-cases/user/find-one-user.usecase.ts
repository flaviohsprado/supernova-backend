import { NotFoundException } from '@nestjs/common';
import { ICacheManager } from '../../../main/interfaces/cache.interface';
import { IUserRepository } from '../../abstracts/repositories/user.repository';
import { User } from '../../entities/user.entity';

export class FindOneUserUseCase {
	constructor(
		private readonly repository: IUserRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(id: string): Promise<User> {
		const cachedUser = await this.cacheManager.getCachedObject<User>('user');

		if (cachedUser) return cachedUser;

		const user: User = await this.repository.findOne(id);

		if (!user) throw new NotFoundException({ message: 'User not found' });

		await this.cacheManager.setObjectInCache('user', user);

		return user;
	}
}
