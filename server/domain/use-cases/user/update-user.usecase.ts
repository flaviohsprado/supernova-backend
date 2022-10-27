import { UpdateUserDTO } from '../../../infra/resolvers/user/user.dto';
import { User } from '../../entities/user.entity';
import { ILogger } from '../../logger/logger.interface';
import { IUserRepository } from '../../repositories/user.repository';
import { IBcryptService } from '../../interfaces/bcrypt.interface';

export class UpdateUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly bcryptService: IBcryptService,
  ) {}

  public async execute(id: string, user: UpdateUserDTO): Promise<User> {
    if (user.password)
      user.password = await this.bcryptService.createHash(user.password);

    const updatedUser = await this.repository.update(id, user);

    this.logger.log(
      'UpdateUserUseCases execute()',
      `User ${id} have been updated`,
    );

    return updatedUser;
  }
}
