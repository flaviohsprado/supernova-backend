import { UpdateAlbumDTO } from '../../../infra/resolvers/album/album.dto';
import { Album } from '../../entities/album.entity';
import { ILogger } from '../../logger/logger.interface';
import { IAlbumRepository } from '../../repositories/album.repository';

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
