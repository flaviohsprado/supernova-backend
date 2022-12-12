import {
	CreatePlaylistDTO,
	UpdatePlaylistDTO,
} from 'server/infra/resolvers/playlist/playlist.dto';
import { Playlist } from '../entities/playlist.entity';

export interface IPlaylistRepository {
	findAll(userid?: string): Promise<Playlist[]>;
	findOne(id: string): Promise<Playlist>;
	create(playlist: CreatePlaylistDTO): Promise<Playlist>;
	update(id: string, user: UpdatePlaylistDTO): Promise<Playlist>;
	delete(id: string): Promise<Playlist>;
}
