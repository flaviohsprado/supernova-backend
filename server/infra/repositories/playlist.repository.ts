import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Music } from '../../domain/entities/music.entity';
import { Playlist } from '../../domain/entities/playlist.entity';
import { IPlaylistRepository } from '../../domain/repositories/playlist.repository';
import {
	CreatePlaylistDTO,
	UpdatePlaylistDTO,
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
			relations: [
				'user',
				'user.file',
				'musics',
				'musics.file',
				'musics.album',
				'musics.album.artist',
				'file',
			],
		});
	}

	public async findOne(id: string): Promise<Playlist> {
		return await this.repository.findOne({
			where: { id },
			relations: [
				'user',
				'user.file',
				'musics',
				'musics.album',
				'musics.album.artist',
				'musics.album.file',
				'musics.file',
				'file',
			],
		});
	}

	public async create(playlist: CreatePlaylistDTO): Promise<Playlist> {
		const newPlaylist = this.repository.create(playlist);

		newPlaylist.musics = [];

		return this.repository.save(newPlaylist);
	}

	public async insertMusic(
		playlistId: string,
		music: Music,
	): Promise<Playlist> {
		const playlist = await this.repository.findOne({
			where: { id: playlistId },
			relations: ['musics'],
		});

		playlist.musics = [...playlist.musics, music];

		return this.repository.save(playlist);
	}

	public async removeMusic(
		playlistId: string,
		musicId: string,
	): Promise<Playlist> {
		const playlist = await this.repository.findOne({
			where: { id: playlistId },
			relations: ['musics'],
		});

		playlist.musics = playlist.musics.filter((music) => music.id !== musicId);

		return this.repository.save(playlist);
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
