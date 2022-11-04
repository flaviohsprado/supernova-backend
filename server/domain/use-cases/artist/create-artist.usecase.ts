import { IArtistRepository } from 'server/domain/repositories/artist.repository';
import { CreateArtistDTO } from 'server/infra/resolvers/artist/artist.dto';
import { ArtistPresenter } from 'server/infra/resolvers/artist/artist.presenter';
import { ILogger } from '../../logger/logger.interface';

export class CreateArtistUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly repository: IArtistRepository,
    ) { }

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
