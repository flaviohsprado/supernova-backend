import { IArtistRepository } from '../../../domain/abstracts/repositories/artist.repository';
import { CreateArtistDTO } from '../../../presentation/dtos/artist.dto';
import { ArtistPresenter } from '../../../presentation/presenters/artist.presenter';
import { ILogger } from '../../abstracts/logger.interface';

export class CreateArtistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IArtistRepository,
	) {}

	public async execute(artist: CreateArtistDTO): Promise<ArtistPresenter> {
		const createdArtist: ArtistPresenter = new ArtistPresenter(
			await this.repository.create(artist),
		);

		this.logger.log(
			'CreateArtistUseCases execute()',
			'New artist have been inserted',
		);

		return createdArtist;
	}
}
