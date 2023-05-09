import { UpdateAlbumDTO } from '../../../presentation/dtos/album.dto';
import { ILogger } from '../../abstracts/logger.interface';
import { IAlbumRepository } from '../../abstracts/repositories/album.repository';
import { Album } from '../../entities/album.entity';

export class UpdateAlbumUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IAlbumRepository,
	) {}

	public async execute(id: string, album: UpdateAlbumDTO): Promise<Album> {
		const updatedAlbum = await this.repository.update(id, album);

		this.logger.log(
			'UpdateAlbumUseCases execute()',
			`Album ${id} have been updated`,
		);

		return updatedAlbum;
	}
}
