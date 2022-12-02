import { UpdateMusicDTO } from '../../../infra/resolvers/music/music.dto';
import { Music } from '../../entities/music.entity';
import { ILogger } from '../../logger/logger.interface';
import { IMusicRepository } from '../../repositories/music.repository';

export class UpdateMusicUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IMusicRepository,
	) {}

	public async execute(id: string, music: UpdateMusicDTO): Promise<Music> {
		const updatedMusic = await this.repository.update(id, music);

		this.logger.log(
			'UpdateMusicUseCases execute()',
			`Music ${id} have been updated`,
		);

		return updatedMusic;
	}
}
