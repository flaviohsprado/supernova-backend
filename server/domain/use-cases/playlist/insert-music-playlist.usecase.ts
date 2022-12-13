import { Playlist } from 'server/domain/entities/playlist.entity';
import { ILogger } from 'server/domain/logger/logger.interface';
import { IMusicRepository } from 'server/domain/repositories/music.repository';
import { IPlaylistRepository } from 'server/domain/repositories/playlist.repository';

export class InsertMusicPlaylistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IPlaylistRepository,
		private readonly musicRepository: IMusicRepository,
	) {}

	public async execute(playlistId: string, musicId: string): Promise<Playlist> {
		const music = await this.musicRepository.findOne(musicId);

		const updatedPlaylist = await this.repository.insertMusic(
			playlistId,
			music,
		);

		this.logger.log(
			'InsertMusicIntoPlaylistUseCases execute()',
			'New playlist have been updated',
		);

		return updatedPlaylist;
	}
}
