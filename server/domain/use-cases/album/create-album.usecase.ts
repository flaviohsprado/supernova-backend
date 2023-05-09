import { IAlbumRepository } from '../../../domain/abstracts/repositories/album.repository';
import { IFileRepository } from '../../../domain/abstracts/repositories/file.repository';
import { EnvironmentConfigService } from '../../../infra/config/environment-config/environment-config.service';
import { OwnerType } from '../../../main/enums/ownerType.enum';
import { IUploadService } from '../../../main/interfaces/upload.interface';
import { CreateAlbumDTO } from '../../../presentation/dtos/album.dto';
import { CreateFileDTO } from '../../../presentation/dtos/file.dto';
import { AlbumPresenter } from '../../../presentation/presenters/album.presenter';
import { ILogger } from '../../abstracts/logger.interface';

export class CreateAlbumUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IAlbumRepository,
		private readonly fileRepository: IFileRepository,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
	) {}

	public async execute(
		album: CreateAlbumDTO,
		file?: CreateFileDTO,
	): Promise<AlbumPresenter> {
		if (file) album.file = await this.createFile(album.id, file);

		const createdAlbum: AlbumPresenter = new AlbumPresenter(
			await this.repository.create(album),
		);

		this.logger.log(
			'CreateAlbumUseCases execute()',
			'New album have been inserted',
		);

		return createdAlbum;
	}

	private async createFile(
		id: string,
		file: CreateFileDTO,
	): Promise<CreateFileDTO> {
		let fileUploaded: CreateFileDTO = file;

		if (this.environmentConfig.getCloudUpload()) {
			fileUploaded = await this.uploadService.uploadFile(file);
		}

		return await this.fileRepository.create(fileUploaded, id, OwnerType.ALBUM);
	}
}
