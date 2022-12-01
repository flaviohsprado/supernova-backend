import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from 'server/domain/entities/album.entity';
import { Artist } from 'server/domain/entities/artist.entity';
import { File } from 'server/domain/entities/file.entity';
import { Music } from 'server/domain/entities/music.entity';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { User } from './../../domain/entities/user.entity';
import { DatabaseAlbumRepository } from './album.repository';
import { DatabaseArtistRepository } from './artist.repository';
import { DatabaseFileRepository } from './file.repository';
import { DatabaseMusicRepository } from './music.repository';
import { DatabaseUserRepository } from './user.repository';

@Module({
	imports: [
		TypeOrmConfigModule,
		TypeOrmModule.forFeature([User, Artist, Album, File, Music]),
	],
	providers: [
		DatabaseUserRepository,
		DatabaseArtistRepository,
		DatabaseAlbumRepository,
		DatabaseFileRepository,
		DatabaseMusicRepository,
	],
	exports: [
		DatabaseUserRepository,
		DatabaseArtistRepository,
		DatabaseAlbumRepository,
		DatabaseFileRepository,
		DatabaseMusicRepository,
	],
})
export class RepositoriesModule {}
