import { HttpStatus } from '@nestjs/common';
import { IExceptionService } from 'server/domain/interfaces/exceptions.interface';
import { IJwtService } from 'server/domain/interfaces/jwt.interface';
import { UserPresenter } from 'server/infra/resolvers/user/user.presenter';
import { CreateUserDTO } from '../../../infra/resolvers/user/user.dto';
import { IBcryptService } from '../../interfaces/bcrypt.interface';
import { ILogger } from '../../logger/logger.interface';
import { IUserRepository } from '../../repositories/user.repository';

export class CreateUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly bcryptService: IBcryptService,
    private readonly jwtService: IJwtService,
    private readonly exceptionService: IExceptionService,
  ) {}

  public async execute(user: CreateUserDTO): Promise<UserPresenter> {
    if (await this.repository.alreadyExists('email', user.email))
      this.exceptionService.throwForbiddenException({
        message: 'Email already exists in app!',
        statusCode: HttpStatus.FORBIDDEN,
      });

    user.password = await this.bcryptService.createHash(user.password);

    const createdUser: UserPresenter = new UserPresenter(
      await this.repository.create(user),
    );

    createdUser.accessToken = this.jwtService.createToken({
      id: createdUser.id,
      username: createdUser.username,
    });

    this.logger.log(
      'CreateUserUseCases execute()',
      'New user have been inserted',
    );

    return createdUser;
  }
}
