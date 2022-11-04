import { Field, ObjectType } from '@nestjs/graphql';
import { Artist } from 'server/domain/entities/artist.entity';
import { User } from '../../../domain/entities/user.entity';

@ObjectType()
export class ArtistPresenter {
    @Field()
    public id: string;

    @Field()
    public name: string;

    @Field()
    public monthlyListeners?: number

    @Field()
    public createdAt?: Date;

    @Field()
    public updatedAt?: Date;

    constructor(artist: Artist) {
        Object.assign(this, artist);
    }
}
