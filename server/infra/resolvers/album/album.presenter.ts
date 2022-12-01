import { Field, ObjectType } from '@nestjs/graphql';
import { Album } from 'server/domain/entities/album.entity';
import { Artist } from 'server/domain/entities/artist.entity';
import { File } from 'server/domain/entities/file.entity';
import { Music } from 'server/domain/entities/music.entity';

@ObjectType()
export class AlbumPresenter {
	@Field()
	public id: string;

	@Field()
	public title: string;

	@Field({ nullable: true })
	public releaseDate?: Date;

	@Field({ nullable: true })
	public numberOfSongs?: number;

	@Field({ nullable: true })
	public duration?: number;

	@Field(() => Artist, { nullable: true })
	public artist?: Artist;

	@Field()
	public createdAt?: Date;

	@Field()
	public updatedAt?: Date;

	@Field({ nullable: true })
	public file?: File;

	@Field(() => [Music], { nullable: true })
	public musics?: Music[];

	constructor(album: Album) {
		Object.assign(this, album);

		this.releaseDate = new Date(this.releaseDate);
	}
}
