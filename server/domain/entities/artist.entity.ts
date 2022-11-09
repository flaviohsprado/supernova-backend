import { Field, ObjectType } from "@nestjs/graphql";
import { IsOptionalNumberColumn } from "server/main/decorators/columns/isOptionalnumberColumn.decorator";
import { IsRequiredStringColumn } from "server/main/decorators/columns/isRequiredStringColumn.decorator";
import { CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Album } from "./album.entity";

@ObjectType()
@Entity()
export class Artist {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Field()
    @IsRequiredStringColumn()
    public name: string;

    @Field()
    @IsOptionalNumberColumn({ default: 0 })
    public monthlyListeners: number

    @Field()
    @CreateDateColumn()
    public createdAt: Date;

    @Field()
    @UpdateDateColumn()
    public updatedAt: Date;

    @Field(() => [Album])
    @OneToMany(() => Album, (album) => album.artist, {
        cascade: true,
        onDelete: 'CASCADE',
        nullable: true,
    })
    public albums?: Album[];
}