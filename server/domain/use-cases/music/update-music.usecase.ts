import { UpdateMusicDTO } from '../../../presentation/dtos/music.dto';
import { ILogger } from '../../abstracts/logger.interface';
import { IMusicRepository } from '../../abstracts/repositories/music.repository';
import { Music } from '../../entities/music.entity';

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
