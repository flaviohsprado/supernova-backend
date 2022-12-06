import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPlaylistRepository } from 'server/domain/repositories/playlist.repository';
import { Repository } from 'typeorm';
import { Playlist } from '../../domain/entities/playlist.entity';
import {
	CreatePlaylistDTO,
	UpdatePlaylistDTO
} from '../resolvers/playlist/playlist.dto';

@Injectable()
export class DatabasePlaylistRepository implements IPlaylistRepository {
	constructor(
		@InjectRepository(Playlist)
		private readonly repository: Repository<Playlist>,
	) {}

	public async findAll(userId?: string): Promise<Playlist[]> {
		return this.repository.find({
			where: { userId },
			relations: ['user', 'user.file', 'musics', 'musics.file'],
		});
	}

	public async findOne(id: string): Promise<Playlist> {
		return await this.repository.findOne({
			where: { id },
			relations: ['user', 'user.file', 'musics', 'musics.file'],
		});
	}

	public async create(playlist: CreatePlaylistDTO): Promise<Playlist> {
		const newPlaylist = this.repository.create(playlist);
		return this.repository.save(newPlaylist);
	}

	public async update(
		id: string,
		playlist: UpdatePlaylistDTO,
	): Promise<Playlist> {
		const updatePlaylist = this.repository.create({
			...playlist,
			id,
		});
		return this.repository.save(updatePlaylist);
	}

	public async delete(id: string): Promise<any> {
		const user = await this.repository.findOne({ where: { id } });

		if (user) {
			this.repository.delete(id);
			return user;
		}
	}
}
