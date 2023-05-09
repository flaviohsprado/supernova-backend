import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ICacheManager } from '../../../main/interfaces/cache.interface';
import { IMusicRepository } from '../../abstracts/repositories/music.repository';
import { Music } from '../../entities/music.entity';

export class FindOneMusicUseCase {
	constructor(
		private readonly repository: IMusicRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(id: string): Promise<Music> {
		const cachedMusic = await this.cacheManager.getCachedObject<Music>('music');

		if (cachedMusic) return cachedMusic;

		const music: Music = await this.repository.findOne(id);

		if (!music)
			throw new NotFoundException({
				message: 'Music not found',
				status: HttpStatus.NOT_FOUND,
			});

		await this.cacheManager.setObjectInCache('music', music);

		return music;
	}
}
