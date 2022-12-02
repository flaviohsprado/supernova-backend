import { IUploadService } from 'server/domain/interfaces/upload.interface';
import { IFileRepository } from 'server/domain/repositories/file.repository';
import { IMusicRepository } from 'server/domain/repositories/music.repository';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { CreateFileDTO } from 'server/infra/resolvers/file/file.dto';
import { CreateMusicDTO } from 'server/infra/resolvers/music/music.dto';
import { MusicPresenter } from 'server/infra/resolvers/music/music.presenter';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { ILogger } from '../../logger/logger.interface';

export class CreateMusicUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IMusicRepository,
		private readonly fileRepository: IFileRepository,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
	) {}

	public async execute(
		music: CreateMusicDTO,
		file?: CreateFileDTO,
	): Promise<MusicPresenter> {
		if (file) music.file = await this.createFile(music.id, file);

		await this.repository.create(music);

		this.logger.log(
			'CreateMusicUseCases execute()',
			'New music have been inserted',
		);

		return new MusicPresenter(await this.repository.findOne(music.id));
	}

	private async createFile(
		id: string,
		file: CreateFileDTO,
	): Promise<CreateFileDTO> {
		let fileUploaded: CreateFileDTO = file;

		if (this.environmentConfig.getCloudUpload()) {
			fileUploaded = await this.uploadService.uploadFile(file);
		}

		return await this.fileRepository.create(fileUploaded, id, OwnerType.MUSIC);
	}
}
