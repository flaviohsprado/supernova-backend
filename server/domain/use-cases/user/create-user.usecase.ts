import {IBcryptService} from '../../interfaces/bcrypt.interface';
import {CreateUserDTO} from '../../../infra/resolvers/user/user.dto';
import {User} from '../../entities/user.entity';
import {ILogger} from '../../logger/logger.interface';
import {IUserRepository} from '../../repositories/user.repository';

export class CreateUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}

  public async execute(user: CreateUserDTO): Promise<User> {
    user.password = await this.bcryptService.createHash(user.password);

    const createdUser = await this.repository.create(user);

    this.logger.log(
      'CreateUserUseCases execute()',
      'New user have been inserted',
    );

    return createdUser;
  }
}
