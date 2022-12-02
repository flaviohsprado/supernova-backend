import { InjectRepository } from '@nestjs/typeorm';
import { Music } from 'server/domain/entities/music.entity';
import { IMusicRepository } from 'server/domain/repositories/music.repository';
import { Repository } from 'typeorm';
import { CreateMusicDTO, UpdateMusicDTO } from '../resolvers/music/music.dto';

export class DatabaseMusicRepository implements IMusicRepository {
	constructor(
		@InjectRepository(Music)
		private readonly repository: Repository<Music>,
	) {}

	public async findAll(): Promise<Music[]> {
		return await this.repository.find({ relations: ['album', 'file'] });
	}

	public async findOne(id: string): Promise<Music> {
		return await this.repository.findOne({
			where: { id },
			relations: ['album', 'file'],
		});
	}

	public async create(music: CreateMusicDTO): Promise<Music> {
		const newMusic = this.repository.create(music);
		return await this.repository.save(newMusic);
	}

	public async update(id: string, music: UpdateMusicDTO): Promise<Music> {
		const newMusic = this.repository.create({ ...music, id });
		return await this.repository.save(newMusic);
	}

	public async delete(id: string): Promise<Music> {
		const music = await this.repository.findOne({ where: { id } });

		if (music) {
			this.repository.delete(id);
			return music;
		}
	}
}
