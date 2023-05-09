import { IFileRepository } from '../../../domain/abstracts/repositories/file.repository';
import { EnvironmentConfigService } from '../../../infra/config/environment-config/environment-config.service';
import { OwnerType } from '../../../main/enums/ownerType.enum';
import { IUploadService } from '../../../main/interfaces/upload.interface';
import { CreateFileDTO } from '../../../presentation/dtos/file.dto';
import { ILogger } from '../../abstracts/logger.interface';
import { IUserRepository } from '../../abstracts/repositories/user.repository';
import { User } from '../../entities/user.entity';

export class UpdateUserFileUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IUserRepository,
		private readonly fileRepository: IFileRepository,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
	) {}

	public async execute(id: string, file?: CreateFileDTO): Promise<User> {
		let fileUploaded: CreateFileDTO = file;

		const user = await this.repository.findOne(id);

		const userFile = await this.fileRepository.findOne(id, OwnerType.USER);

		if (this.environmentConfig.getCloudUpload()) {
			await this.uploadService.deleteFile([userFile.key]);
			fileUploaded = await this.uploadService.uploadFile(file);
		}

		await this.fileRepository.delete(id, OwnerType.USER);

		user.file = await this.fileRepository.update(
			fileUploaded,
			id,
			OwnerType.USER,
		);

		const updatedUser = await this.repository.update(id, user);

		this.logger.log(
			'UpdateUserFileUseCases execute()',
			`File ${fileUploaded.originalname} have been updated`,
		);

		return updatedUser;
	}
}
