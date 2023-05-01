import { HttpStatus } from '@nestjs/common';
import { File } from 'server/domain/entities/file.entity';
import { IUploadService } from 'server/domain/interfaces/upload.interface';
import { IFileRepository } from 'server/domain/repositories/file.repository';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { Playlist } from '../../entities/playlist.entity';
import { IExceptionService } from '../../interfaces/exceptions.interface';
import { ILogger } from '../../logger/logger.interface';
import { IPlaylistRepository } from '../../repositories/playlist.repository';

export class DeletePlaylistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IPlaylistRepository,
		private readonly exceptionService: IExceptionService,
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
			this.exceptionService.throwNotFoundException({
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
