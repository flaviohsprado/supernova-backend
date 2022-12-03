import { IUploadService } from 'server/domain/interfaces/upload.interface';
import { IAlbumRepository } from 'server/domain/repositories/album.repository';
import { IFileRepository } from 'server/domain/repositories/file.repository';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { CreateAlbumDTO } from 'server/infra/resolvers/album/album.dto';
import { AlbumPresenter } from 'server/infra/resolvers/album/album.presenter';
import { CreateFileDTO } from 'server/infra/resolvers/file/file.dto';
import { OwnerType } from 'server/main/enums/ownerType.enum';
import { ILogger } from '../../logger/logger.interface';

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
