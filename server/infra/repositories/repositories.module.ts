import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from 'server/domain/entities/album.entity';
import { Artist } from 'server/domain/entities/artist.entity';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { User } from './../../domain/entities/user.entity';
import { DatabaseAlbumRepository } from './album.repository';
import { DatabaseArtistRepository } from './artist.repository';
import { DatabaseUserRepository } from './user.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User, Artist, Album])],
  providers: [DatabaseUserRepository, DatabaseArtistRepository, DatabaseAlbumRepository],
  exports: [DatabaseUserRepository, DatabaseArtistRepository, DatabaseAlbumRepository],
})
export class RepositoriesModule { }
