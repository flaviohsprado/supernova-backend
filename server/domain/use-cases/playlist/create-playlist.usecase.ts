import { IPlaylistRepository } from 'server/domain/repositories/playlist.repository';
import { CreatePlaylistDTO } from 'server/infra/resolvers/playlist/playlist.dto';
import { PlaylistPresenter } from 'server/infra/resolvers/playlist/playlist.presenter';
import { ILogger } from '../../logger/logger.interface';

export class CreatePlaylistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IPlaylistRepository,
	) {}

	public async execute(
		playlist: CreatePlaylistDTO,
	): Promise<PlaylistPresenter> {
		const createdPlaylist: PlaylistPresenter = new PlaylistPresenter(
			await this.repository.create(playlist),
		);

		this.logger.log(
			'CreatePlaylistUseCases execute()',
			'New playlist have been inserted',
		);

		return createdPlaylist;
	}
}
