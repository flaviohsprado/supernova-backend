import { IUploadService } from 'server/domain/interfaces/upload.interface';
import { IFileRepository } from 'server/domain/repositories/file.repository';
import { IPlaylistRepository } from 'server/domain/repositories/playlist.repository';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { CreateFileDTO } from 'server/infra/resolvers/file/file.dto';
import { CreatePlaylistDTO } from 'server/infra/resolvers/playlist/playlist.dto';
import { PlaylistPresenter } from 'server/infra/resolvers/playlist/playlist.presenter';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { ILogger } from '../../logger/logger.interface';

export class CreatePlaylistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IPlaylistRepository,
		private readonly fileRepository: IFileRepository,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
	) {}

	public async execute(
		playlist: CreatePlaylistDTO,
		file?: CreateFileDTO,
	): Promise<PlaylistPresenter> {
		if (file) playlist.file = await this.createFile(playlist.id, file);

		const createdPlaylist: PlaylistPresenter = new PlaylistPresenter(
			await this.repository.create(playlist),
		);

		this.logger.log(
			'CreatePlaylistUseCases execute()',
			'New playlist have been inserted',
		);

		return createdPlaylist;
	}

	private async createFile(
		id: string,
		file: CreateFileDTO,
	): Promise<CreateFileDTO> {
		let fileUploaded: CreateFileDTO = file;

		if (this.environmentConfig.getCloudUpload()) {
			fileUploaded = await this.uploadService.uploadFile(file);
		}

		return await this.fileRepository.create(
			fileUploaded,
			id,
			OwnerType.PLAYLIST,
		);
	}
}
