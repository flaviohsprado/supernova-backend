import { ICacheManager } from '../../../main/interfaces/cache.interface';
import { IMusicRepository } from '../../abstracts/repositories/music.repository';
import { Music } from '../../entities/music.entity';

export class FindAllMusicUseCase {
	constructor(
		private readonly repository: IMusicRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(): Promise<Music[]> {
		const cachedMusics = await this.cacheManager.getCachedObject<Music[]>(
			'musics',
		);

		if (cachedMusics) return cachedMusics;

		const musics = await this.repository.findAll();

		await this.cacheManager.setObjectInCache('musics', musics);

		return musics;
	}
}
