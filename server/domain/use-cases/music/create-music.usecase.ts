import { IFileRepository } from '../../../domain/abstracts/repositories/file.repository';
import { IMusicRepository } from '../../../domain/abstracts/repositories/music.repository';
import { EnvironmentConfigService } from '../../../infra/config/environment-config/environment-config.service';
import { OwnerType } from '../../../main/enums/ownerType.enum';
import { IUploadService } from '../../../main/interfaces/upload.interface';
import { CreateFileDTO } from '../../../presentation/dtos/file.dto';
import { CreateMusicDTO } from '../../../presentation/dtos/music.dto';
import { MusicPresenter } from '../../../presentation/presenters/music.presenter';
import { ILogger } from '../../abstracts/logger.interface';

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
