import { Field, ObjectType } from '@nestjs/graphql';
import { Artist } from 'server/domain/entities/artist.entity';
import { File } from 'server/domain/entities/file.entity';
import { Music } from 'server/domain/entities/music.entity';

@ObjectType()
export class AlbumPresenter {
	@Field()
	public id: string;

	@Field()
	public title: string;

	@Field()
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

	constructor(album: AlbumPresenter) {
		this.id = album.id;
		this.title = album.title;
		this.releaseDate = new Date(album.releaseDate);
		this.duration = this.musics
			? this.musics?.reduce((acc, curr) => acc + curr.duration, 0)
			: 0;
		this.numberOfSongs = this.musics ? this.musics?.length : 0;
		this.artist = album.artist;
		this.createdAt = album.createdAt;
		this.updatedAt = album.updatedAt;
		this.file = album.file;
		this.musics = album.musics;
	}
}
