import { IUploadService } from 'server/domain/interfaces/upload.interface';
import { IFileRepository } from 'server/domain/repositories/file.repository';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { CreateFileDTO } from 'server/infra/resolvers/file/file.dto';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { User } from '../../entities/user.entity';
import { ILogger } from '../../logger/logger.interface';
import { IUserRepository } from '../../repositories/user.repository';

export class UpdateUserFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly fileRepository: IFileRepository,    
    private readonly uploadService: IUploadService,
    private readonly environmentConfig: EnvironmentConfigService,
  ) { }

  public async execute(id: string, file?: CreateFileDTO): Promise<User> {
    let fileUploaded: CreateFileDTO = file

    const user = await this.repository.findOne(id);

    const userFile = await this.fileRepository.findOne(id, OwnerType.USER);
    
    if (this.environmentConfig.getCloudUpload()) {
        await this.uploadService.deleteFile([userFile.key]);
        fileUploaded = await this.uploadService.uploadFile(file);
    }

    await this.fileRepository.delete(id, OwnerType.USER);

    user.file = await this.fileRepository.update(fileUploaded, id, OwnerType.USER);

    const updatedUser = await this.repository.update(id, user);

    this.logger.log(
      'UpdateUserFileUseCases execute()',
      `File ${fileUploaded.originalname} have been updated`,
    );

    return updatedUser;
  }
}
