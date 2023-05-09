import { ICacheManager } from '../../../main/interfaces/cache.interface';
import { PlaylistPresenter } from '../../../presentation/presenters/playlist.presenter';
import { IPlaylistRepository } from '../../abstracts/repositories/playlist.repository';
import { Playlist } from '../../entities/playlist.entity';

export class FindAllPlaylistUseCase {
	constructor(
		private readonly repository: IPlaylistRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(userId?: string): Promise<PlaylistPresenter[]> {
		const cachedPlaylists = await this.cacheManager.getCachedObject<Playlist[]>(
			'playlists',
		);

		if (cachedPlaylists) return cachedPlaylists;

		const playlists = await this.repository.findAll(userId);

		await this.cacheManager.setObjectInCache('playlists', playlists);

		return playlists.map((playlist) => new PlaylistPresenter(playlist));
	}
}
