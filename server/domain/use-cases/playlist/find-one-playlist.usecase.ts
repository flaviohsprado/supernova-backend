import { Playlist } from 'server/domain/entities/playlist.entity';
import { IPlaylistRepository } from 'server/domain/repositories/playlist.repository';
import { ICacheManager } from '../../interfaces/cache.interface';
import { IExceptionService } from '../../interfaces/exceptions.interface';

export class FindOnePlaylistUseCase {
	constructor(
		private readonly repository: IPlaylistRepository,
		private readonly exceptionService: IExceptionService,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(id: string): Promise<Playlist> {
		const cachedPlaylist = await this.cacheManager.getCachedObject<Playlist>(
			'playlist',
		);

		if (cachedPlaylist) return cachedPlaylist;

		const playlist: Playlist = await this.repository.findOne(id);

		if (!playlist)
			this.exceptionService.throwNotFoundException({
				message: 'Playlist not found',
			});

		await this.cacheManager.setObjectInCache('playlist', playlist);

		return playlist;
	}
}
