import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'server/domain/entities/artist.entity';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { User } from './../../domain/entities/user.entity';
import { DatabaseArtistRepository } from './artist.repository';
import { DatabaseUserRepository } from './user.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User, Artist])],
  providers: [DatabaseUserRepository, DatabaseArtistRepository],
  exports: [DatabaseUserRepository, DatabaseArtistRepository],
})
export class RepositoriesModule { }
