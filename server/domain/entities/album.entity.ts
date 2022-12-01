import { Field, ObjectType } from '@nestjs/graphql';
import { IsRequiredDateColumn } from 'server/main/decorators/columns/isRequiredDateColumn.decorator';
import { IsRequiredStringColumn } from 'server/main/decorators/columns/isRequiredStringColumn.decorator';
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { Artist } from './artist.entity';
import { File } from './file.entity';
import { Music } from './music.entity';

@ObjectType()
@Entity()
export class Album {
	@Field()
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Field()
	@IsRequiredStringColumn()
	public artistId: string;

	@Field()
	@IsRequiredStringColumn()
	public title: string;

	//public numberOfSongs: number

	/*@Field()
    @IsRequiredNumberColumn()
    public duration: number*/

	/*@Expose({ name: 'total' })
    @ApiProperty({ type: 'number' })
    public get numberOfSongs(): number {
      return this.songs?.reduce((value, song) => value + song.total, 0) || 0;
    }*/

	@Field({ nullable: true })
	@IsRequiredDateColumn({ nullable: true })
	public releaseDate: Date;

	@Field()
	@CreateDateColumn()
	public createdAt: Date;

	@Field()
	@UpdateDateColumn()
	public updatedAt: Date;

	@ManyToOne(() => Artist, (Artist) => Artist.id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'artistId' })
	public artist: Artist;

	@Field(() => [Music])
	@OneToMany(() => Music, (Music) => Music.album, {
		cascade: true,
		onDelete: 'CASCADE',
		nullable: true,
	})
	public musics?: Music[];

	@Field(() => File, { nullable: true })
	@OneToOne(() => File, (file) => file.ownerId, {
		cascade: true,
		onDelete: 'CASCADE',
		nullable: true,
	})
	@JoinColumn()
	public file?: File;
}
