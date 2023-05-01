import { IUploadService } from 'server/domain/interfaces/upload.interface';
import { IFileRepository } from 'server/domain/repositories/file.repository';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { CreateFileDTO } from 'server/infra/resolvers/file/file.dto';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { Playlist } from '../../entities/playlist.entity';
import { ILogger } from '../../logger/logger.interface';
import { IPlaylistRepository } from '../../repositories/playlist.repository';

export class UpdatePlaylistFileUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IPlaylistRepository,
		private readonly fileRepository: IFileRepository,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
	) {}

	public async execute(id: string, file?: CreateFileDTO): Promise<Playlist> {
		let fileUploaded: CreateFileDTO = file;

		const playlist = await this.repository.findOne(id);

		const playlistFile = await this.fileRepository.findOne(
			id,
			OwnerType.PLAYLIST,
		);

		if (this.environmentConfig.getCloudUpload()) {
			if (playlistFile) await this.uploadService.deleteFile([playlistFile.key]);

			fileUploaded = await this.uploadService.uploadFile(file);
		}

		if (playlistFile) await this.fileRepository.delete(id, OwnerType.PLAYLIST);

		playlist.file = await this.fileRepository.update(
			fileUploaded,
			id,
			OwnerType.PLAYLIST,
		);

		const updatedPlaylist = await this.repository.update(id, playlist);

		this.logger.log(
			'UpdatePlaylistFileUseCases execute()',
			`File ${fileUploaded.originalname} have been updated`,
		);

		return updatedPlaylist;
	}
}
