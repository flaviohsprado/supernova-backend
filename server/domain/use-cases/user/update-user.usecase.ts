import { HttpStatus } from '@nestjs/common';
import { IExceptionService } from 'server/domain/interfaces/exceptions.interface';
import { UpdateUserDTO } from '../../../infra/resolvers/user/user.dto';
import { User } from '../../entities/user.entity';
import { IBcryptService } from '../../interfaces/bcrypt.interface';
import { ILogger } from '../../logger/logger.interface';
import { IUserRepository } from '../../repositories/user.repository';

export class UpdateUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly bcryptService: IBcryptService,
    private readonly exceptionService: IExceptionService,
  ) { }

  public async execute(id: string, user: UpdateUserDTO): Promise<User> {
    if (this.repository.alreadyExists('email', user.email, id))
      this.exceptionService.throwForbiddenException({
        message: 'Email already exists in app!',
        statusCode: HttpStatus.FORBIDDEN
      })

    if (user.password) {
      user.password = await this.bcryptService.createHash(user.password);
    } else {
      delete user.password;
    }

    const updatedUser = await this.repository.update(id, user);

    this.logger.log(
      'UpdateUserUseCases execute()',
      `User ${id} have been updated`,
    );

    return updatedUser;
  }
}
