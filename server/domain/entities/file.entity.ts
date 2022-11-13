import { Field, ObjectType } from "@nestjs/graphql";
import { IsOptionalStringColumn } from "server/main/decorators/columns/isOptionalStringColumn.decorator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@ObjectType()
@Entity()
export class File {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Field()
    @IsOptionalStringColumn()
    public originalname?: string;

    @Field()
    @IsOptionalStringColumn()
    public ownerId: string;

    @Field()
    @IsOptionalStringColumn()
    public ownerType: string;

    @Field()
    @IsOptionalStringColumn()
    public key: string;

    @Field()
    @IsOptionalStringColumn()
    public url: string;

    @Field(() => GraphQLUpload)
    @Column({ type: 'bytea', nullable: true })
    public buffer?: Buffer;
}