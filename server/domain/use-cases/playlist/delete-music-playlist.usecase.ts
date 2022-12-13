import { Playlist } from 'server/domain/entities/playlist.entity';
import { ILogger } from 'server/domain/logger/logger.interface';
import { IMusicRepository } from 'server/domain/repositories/music.repository';
import { IPlaylistRepository } from 'server/domain/repositories/playlist.repository';

export class DeleteMusicPlaylistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IPlaylistRepository,
		private readonly musicRepository: IMusicRepository,
	) {}

	public async execute(playlistId: string, musicId: string): Promise<Playlist> {
		const updatedPlaylist = await this.repository.removeMusic(
			playlistId,
			musicId,
		);

		this.logger.log(
			'DeleteMusicFromPlaylistUseCases execute()',
			'New playlist have been updated',
		);

		return updatedPlaylist;
	}
}
