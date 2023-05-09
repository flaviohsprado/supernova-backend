import { HttpStatus, NotFoundException } from '@nestjs/common';
import { IFileRepository } from 'server/domain/abstracts/repositories/file.repository';
import { File } from 'server/domain/entities/file.entity';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { IUploadService } from 'server/main/interfaces/upload.interface';
import { ILogger } from '../../abstracts/logger.interface';
import { IAlbumRepository } from '../../abstracts/repositories/album.repository';
import { Album } from '../../entities/album.entity';

export class DeleteAlbumUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IAlbumRepository,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
		private readonly fileRepository: IFileRepository,
	) {}

	public async execute(id: string): Promise<Album> {
		const albumDeleted = await this.repository.delete(id);
		await this.deleteFile(id);

		if (albumDeleted) {
			this.logger.log(
				'DeleteAlbumUseCases execute()',
				`Album ${id} have been deleted`,
			);

			return albumDeleted;
		} else {
			throw new NotFoundException({
				message: 'Album not found!',
				statusCode: HttpStatus.NOT_FOUND,
			});
		}
	}

	private async deleteFile(id: string): Promise<File> {
		const file = await this.fileRepository.findOne(id, OwnerType.ALBUM);

		if (!file) return;

		if (this.environmentConfig.getCloudUpload()) {
			await this.uploadService.deleteFile([file.key]);
		}

		return await this.fileRepository.delete(id, OwnerType.ALBUM);
	}
}
