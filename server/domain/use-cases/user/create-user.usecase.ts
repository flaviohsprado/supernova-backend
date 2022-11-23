import { HttpStatus } from '@nestjs/common';
import { IExceptionService } from 'server/domain/interfaces/exceptions.interface';
import { IJwtService } from 'server/domain/interfaces/jwt.interface';
import { IUploadService } from 'server/domain/interfaces/upload.interface';
import { IFileRepository } from 'server/domain/repositories/file.repository';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { CreateFileDTO } from 'server/infra/resolvers/file/file.dto';
import { UserPresenter } from 'server/infra/resolvers/user/user.presenter';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { CreateUserDTO } from '../../../infra/resolvers/user/user.dto';
import { IBcryptService } from '../../interfaces/bcrypt.interface';
import { ILogger } from '../../logger/logger.interface';
import { IUserRepository } from '../../repositories/user.repository';

export class CreateUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly fileRepository: IFileRepository,
    private readonly bcryptService: IBcryptService,
    private readonly jwtService: IJwtService,
    private readonly exceptionService: IExceptionService,
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: EnvironmentConfigService,
  ) { }

  public async execute(user: CreateUserDTO, file?: CreateFileDTO): Promise<UserPresenter> {
    if (await this.repository.alreadyExists('email', user.email))
      this.exceptionService.throwForbiddenException({
        message: 'Email already exists in app!',
        statusCode: HttpStatus.FORBIDDEN,
      });

    if (file)
      user.file = await this.createFile(user.id, file);

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

  private async createFile(id: string, file: CreateFileDTO): Promise<CreateFileDTO> {
    let fileUploaded: CreateFileDTO = file

    if (this.environmentConfig.getCloudUpload()) {
      fileUploaded = await this.uploadService.uploadFile(file);
    }

    return await this.fileRepository.create(fileUploaded, id, OwnerType.USER);
  }
}
