import { IAlbumRepository } from 'server/domain/repositories/album.repository';
import { CreateAlbumDTO } from 'server/infra/resolvers/album/album.dto';
import { AlbumPresenter } from 'server/infra/resolvers/album/album.presenter';
import { ILogger } from '../../logger/logger.interface';

export class CreateAlbumUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly repository: IAlbumRepository,
    ) { }

    public async execute(album: CreateAlbumDTO): Promise<AlbumPresenter> {
        const createdAlbum: AlbumPresenter = new AlbumPresenter(
            await this.repository.create(album),
        );

        this.logger.log(
            'CreateAlbumUseCases execute()',
            'New album have been inserted',
        );

        return createdAlbum;
    }
}
