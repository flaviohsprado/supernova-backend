import { UpdateUserDTO } from '../../../infra/resolvers/user/user.dto';
import { User } from '../../entities/user.entity';
import { ILogger } from '../../logger/logger.interface';
import { IUserRepository } from '../../repositories/user.repository';
import { IBcryptService } from '../../interfaces/bcrypt.interface';
import { IExceptionService } from 'server/domain/interfaces/exceptions.interface';
import { HttpStatus } from '@nestjs/common';
import { CreateFileDTO } from 'server/infra/resolvers/file/file.dto';
import { IFileRepository } from 'server/domain/repositories/file.repository';
import { OwnerType } from 'server/main/enums/ownerType.enum';

export class UpdateUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly fileRepository: IFileRepository,
    private readonly bcryptService: IBcryptService,
    private readonly exceptionService: IExceptionService
  ) { }

  public async execute(id: string, user: UpdateUserDTO, file?: CreateFileDTO): Promise<User> {
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

    if (file)
      await this.fileRepository.update(file, updatedUser.id, OwnerType.USER);

    this.logger.log(
      'UpdateUserUseCases execute()',
      `User ${id} have been updated`,
    );

    return updatedUser;
  }
}
