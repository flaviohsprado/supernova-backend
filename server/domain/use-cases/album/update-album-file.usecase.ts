import { IFileRepository } from '../../../domain/abstracts/repositories/file.repository';
import { EnvironmentConfigService } from '../../../infra/config/environment-config/environment-config.service';
import { OwnerType } from '../../../main/enums/ownerType.enum';
import { IUploadService } from '../../../main/interfaces/upload.interface';
import { CreateFileDTO } from '../../../presentation/dtos/file.dto';
import { ILogger } from '../../abstracts/logger.interface';
import { IAlbumRepository } from '../../abstracts/repositories/album.repository';
import { Album } from '../../entities/album.entity';

export class UpdateAlbumFileUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IAlbumRepository,
		private readonly fileRepository: IFileRepository,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
	) {}

	public async execute(id: string, file?: CreateFileDTO): Promise<Album> {
		let fileUploaded: CreateFileDTO = file;

		const album = await this.repository.findOne(id);

		const albumFile = await this.fileRepository.findOne(id, OwnerType.ALBUM);

		if (this.environmentConfig.getCloudUpload()) {
			if (albumFile) await this.uploadService.deleteFile([albumFile.key]);

			fileUploaded = await this.uploadService.uploadFile(file);
		}

		if (albumFile) await this.fileRepository.delete(id, OwnerType.ALBUM);

		album.file = await this.fileRepository.update(
			fileUploaded,
			id,
			OwnerType.ALBUM,
		);

		const updatedAlbum = await this.repository.update(id, album);

		this.logger.log(
			'UpdateAlbumFileUseCases execute()',
			`File ${fileUploaded.originalname} have been updated`,
		);

		return updatedAlbum;
	}
}
