import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository';
import { IExceptionService } from '../../interfaces/exceptions.interface';
import { ICacheManager } from '../../interfaces/cache.interface';

export class FindUserByKeyUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly exceptionService: IExceptionService,
    private readonly cacheManager: ICacheManager,
  ) {}

  public async execute(key: string, value: string): Promise<User> {
    const cachedUser = await this.cacheManager.getCachedObject<User>(
      'userById',
    );

    if (cachedUser) return cachedUser;

    const user: User = await this.repository.findByKey(key, value);

    if (!user)
      this.exceptionService.throwNotFoundException({
        message: 'User not found',
      });

    await this.cacheManager.setObjectInCache('userById', user);

    return user;
  }
}
