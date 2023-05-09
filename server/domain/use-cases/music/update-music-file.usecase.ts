import { IFileRepository } from '../../../domain/abstracts/repositories/file.repository';
import { EnvironmentConfigService } from '../../../infra/config/environment-config/environment-config.service';
import { OwnerType } from '../../../main/enums/ownerType.enum';
import { IUploadService } from '../../../main/interfaces/upload.interface';
import { CreateFileDTO } from '../../../presentation/dtos/file.dto';
import { ILogger } from '../../abstracts/logger.interface';
import { IMusicRepository } from '../../abstracts/repositories/music.repository';
import { Music } from '../../entities/music.entity';

export class UpdateMusicFileUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IMusicRepository,
		private readonly fileRepository: IFileRepository,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
	) {}

	public async execute(id: string, file?: CreateFileDTO): Promise<Music> {
		let fileUploaded: CreateFileDTO = file;

		const music = await this.repository.findOne(id);

		const musicFile = await this.fileRepository.findOne(id, OwnerType.MUSIC);

		if (this.environmentConfig.getCloudUpload()) {
			if (musicFile) await this.uploadService.deleteFile([musicFile.key]);
			fileUploaded = await this.uploadService.uploadFile(file);
		}

		if (musicFile) await this.fileRepository.delete(id, OwnerType.MUSIC);

		music.file = await this.fileRepository.update(
			fileUploaded,
			id,
			OwnerType.MUSIC,
		);

		const updatedMusic = await this.repository.update(id, music);

		this.logger.log(
			'UpdateMusicFileUseCases execute()',
			`File ${fileUploaded.originalname} have been updated`,
		);

		return updatedMusic;
	}
}
