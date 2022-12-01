import { UpdateArtistDTO } from '../../../infra/resolvers/artist/artist.dto';
import { Artist } from '../../entities/artist.entity';
import { ILogger } from '../../logger/logger.interface';
import { IArtistRepository } from '../../repositories/artist.repository';

export class UpdateArtistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IArtistRepository,
	) {}

	public async execute(id: string, artist: UpdateArtistDTO): Promise<Artist> {
		const updatedArtist = await this.repository.update(id, artist);

		this.logger.log(
			'UpdateArtistUseCases execute()',
			`Artist ${id} have been updated`,
		);

		return updatedArtist;
	}
}
