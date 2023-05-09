import { HttpStatus, NotFoundException } from '@nestjs/common';
import { IFileRepository } from 'server/domain/abstracts/repositories/file.repository';
import { File } from 'server/domain/entities/file.entity';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { IUploadService } from 'server/main/interfaces/upload.interface';
import { ILogger } from '../../abstracts/logger.interface';
import { IUserRepository } from '../../abstracts/repositories/user.repository';
import { User } from '../../entities/user.entity';

export class DeleteUserUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IUserRepository,
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
			throw new NotFoundException({
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
