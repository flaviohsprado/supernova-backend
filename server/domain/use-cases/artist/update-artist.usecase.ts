import { UpdateArtistDTO } from '../../../presentation/dtos/artist.dto';
import { ILogger } from '../../abstracts/logger.interface';
import { IArtistRepository } from '../../abstracts/repositories/artist.repository';
import { Artist } from '../../entities/artist.entity';

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
