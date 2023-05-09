import {
	CreatePlaylistDTO,
	UpdatePlaylistDTO,
} from '../../../presentation/dtos/playlist.dto';
import { Music } from '../../entities/music.entity';
import { Playlist } from '../../entities/playlist.entity';

export interface IPlaylistRepository {
	findAll(userid?: string): Promise<Playlist[]>;
	findOne(id: string): Promise<Playlist>;
	create(playlist: CreatePlaylistDTO): Promise<Playlist>;
	insertMusic(playlistId: string, music: Music): Promise<Playlist>;
	removeMusic(playlistId: string, musicId: string): Promise<Playlist>;
	update(id: string, user: UpdatePlaylistDTO): Promise<Playlist>;
	delete(id: string): Promise<Playlist>;
}
