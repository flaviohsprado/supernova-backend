import { UpdatePlaylistDTO } from '../../../presentation/dtos/playlist.dto';
import { ILogger } from '../../abstracts/logger.interface';
import { IPlaylistRepository } from '../../abstracts/repositories/playlist.repository';
import { Playlist } from '../../entities/playlist.entity';

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
