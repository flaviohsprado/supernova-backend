import { HttpStatus, NotFoundException } from '@nestjs/common';
import { IFileRepository } from 'server/domain/abstracts/repositories/file.repository';
import { File } from 'server/domain/entities/file.entity';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { IUploadService } from 'server/main/interfaces/upload.interface';
import { ILogger } from '../../abstracts/logger.interface';
import { IPlaylistRepository } from '../../abstracts/repositories/playlist.repository';
import { Playlist } from '../../entities/playlist.entity';

export class DeletePlaylistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IPlaylistRepository,
		private readonly fileRepository: IFileRepository,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
	) {}

	public async execute(id: string): Promise<Playlist> {
		const playlistDeleted = await this.repository.delete(id);

		await this.deleteFile(id);

		if (playlistDeleted) {
			this.logger.log(
				'DeletePlaylistUseCases execute()',
				`Playlist ${id} have been deleted`,
			);

			return playlistDeleted;
		} else {
			throw new NotFoundException({
				message: 'Playlist not found!',
				statusCode: HttpStatus.NOT_FOUND,
			});
		}
	}

	private async deleteFile(id: string): Promise<File> {
		const file = await this.fileRepository.findOne(id, OwnerType.PLAYLIST);

		if (!file) return;

		if (this.environmentConfig.getCloudUpload()) {
			await this.uploadService.deleteFile([file.key]);
		}

		return await this.fileRepository.delete(id, OwnerType.PLAYLIST);
	}
}
