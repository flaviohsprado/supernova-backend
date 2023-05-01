import { UpdatePlaylistDTO } from '../../../infra/resolvers/playlist/playlist.dto';
import { Playlist } from '../../entities/playlist.entity';
import { ILogger } from '../../logger/logger.interface';
import { IPlaylistRepository } from '../../repositories/playlist.repository';

export class UpdatePlaylistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IPlaylistRepository,
	) {}

	public async execute(
		id: string,
		playlist: UpdatePlaylistDTO,
	): Promise<Playlist> {
		const updatedPlaylist = await this.repository.update(id, playlist);

		this.logger.log(
			'UpdatePlaylistUseCases execute()',
			`Playlist ${id} have been updated`,
		);

		return updatedPlaylist;
	}
}
