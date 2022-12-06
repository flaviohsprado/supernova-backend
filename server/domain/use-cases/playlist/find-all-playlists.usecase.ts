import { Playlist } from '../../entities/playlist.entity';
import { ICacheManager } from '../../interfaces/cache.interface';
import { IPlaylistRepository } from '../../repositories/playlist.repository';

export class FindAllPlaylistUseCase {
	constructor(
		private readonly repository: IPlaylistRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(userId?: string): Promise<Playlist[]> {
		const cachedPlaylists = await this.cacheManager.getCachedObject<Playlist[]>(
			'playlists',
		);

		if (cachedPlaylists) return cachedPlaylists;

		const playlists = await this.repository.findAll(userId);

		await this.cacheManager.setObjectInCache('playlists', playlists);

		return playlists;
	}
}
