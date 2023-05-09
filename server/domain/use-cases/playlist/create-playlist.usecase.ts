import { IFileRepository } from '../../../domain/abstracts/repositories/file.repository';
import { IPlaylistRepository } from '../../../domain/abstracts/repositories/playlist.repository';
import { EnvironmentConfigService } from '../../../infra/config/environment-config/environment-config.service';
import { OwnerType } from '../../../main/enums/ownerType.enum';
import { IUploadService } from '../../../main/interfaces/upload.interface';
import { CreateFileDTO } from '../../../presentation/dtos/file.dto';
import { CreatePlaylistDTO } from '../../../presentation/dtos/playlist.dto';
import { PlaylistPresenter } from '../../../presentation/presenters/playlist.presenter';
import { ILogger } from '../../abstracts/logger.interface';

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
