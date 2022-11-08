import { Field, ObjectType } from '@nestjs/graphql';
import { Album } from 'server/domain/entities/album.entity';

@ObjectType()
export class AlbumPresenter {
    @Field()
    public id: string;

    @Field()
    public title: string;

    //@Field()
    //public songs?: Song[]

    @Field({ nullable: true })
    public releaseDate?: Date;

    @Field({ nullable: true })
    public numberOfSongs?: number

    @Field({ nullable: true })
    public duration?: number

    @Field()
    public createdAt?: Date;

    @Field()
    public updatedAt?: Date;

    constructor(album: Album) {
        Object.assign(this, album);

        this.releaseDate = new Date(this.releaseDate);
    }
}
