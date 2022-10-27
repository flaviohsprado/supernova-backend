import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository';
import { ICacheManager } from '../../interfaces/cache.interface';

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
