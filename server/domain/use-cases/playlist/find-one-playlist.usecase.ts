import { HttpStatus, NotFoundException } from '@nestjs/common';
import { IPlaylistRepository } from 'server/domain/abstracts/repositories/playlist.repository';
import { Playlist } from 'server/domain/entities/playlist.entity';
import { PlaylistPresenter } from 'server/presentation/presenters/playlist.presenter';
import { ICacheManager } from '../../../main/interfaces/cache.interface';

export class FindOnePlaylistUseCase {
	constructor(
		private readonly repository: IPlaylistRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(id: string): Promise<PlaylistPresenter> {
		const cachedPlaylist = await this.cacheManager.getCachedObject<Playlist>(
			'playlist',
		);

		if (cachedPlaylist && cachedPlaylist.id === id) return cachedPlaylist;

		const playlist: Playlist = await this.repository.findOne(id);

		if (!playlist)
			throw new NotFoundException({
				message: 'Playlist not found',
				status: HttpStatus.NOT_FOUND,
			});

		await this.cacheManager.setObjectInCache('playlist', playlist);

		return new PlaylistPresenter(playlist);
	}
}
