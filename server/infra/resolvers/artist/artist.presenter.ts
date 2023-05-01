import { Field, ObjectType } from '@nestjs/graphql';
import { Album } from 'server/domain/entities/album.entity';
import { Artist } from 'server/domain/entities/artist.entity';

@ObjectType()
export class ArtistPresenter {
	@Field()
	public id: string;

	@Field()
	public name: string;

	@Field()
	public monthlyListeners?: number;

	@Field()
	public createdAt?: Date;

	@Field()
	public updatedAt?: Date;

	@Field(() => [Album])
	public albums?: Album[];

	constructor(artist: Artist) {
		this.id = artist.id;
		this.name = artist.name;
		this.monthlyListeners = artist.monthlyListeners;
		this.createdAt = artist.createdAt;
		this.updatedAt = artist.updatedAt;
		this.albums = artist.albums;
	}
}
