import { HttpStatus } from '@nestjs/common';
import { File } from 'server/domain/entities/file.entity';
import { IUploadService } from 'server/domain/interfaces/upload.interface';
import { IFileRepository } from 'server/domain/repositories/file.repository';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { User } from '../../entities/user.entity';
import { IExceptionService } from '../../interfaces/exceptions.interface';
import { ILogger } from '../../logger/logger.interface';
import { IUserRepository } from '../../repositories/user.repository';

export class DeleteUserUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IUserRepository,
		private readonly exceptionService: IExceptionService,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
		private readonly fileRepository: IFileRepository,
	) {}

	public async execute(id: string): Promise<User> {
		const userDeleted = await this.repository.delete(id);
		await this.deleteFile(id);

		if (userDeleted) {
			this.logger.log(
				'DeleteUserUseCases execute()',
				`User ${id} have been deleted`,
			);

			return userDeleted;
		} else {
			this.exceptionService.throwNotFoundException({
				message: 'User not found!',
				statusCode: HttpStatus.NOT_FOUND,
			});
		}
	}

	private async deleteFile(id: string): Promise<File> {
		const file = await this.fileRepository.findOne(id, OwnerType.USER);

		if (!file) return;

		if (this.environmentConfig.getCloudUpload()) {
			await this.uploadService.deleteFile([file.key]);
		}

		return await this.fileRepository.delete(id, OwnerType.USER);
	}
}
