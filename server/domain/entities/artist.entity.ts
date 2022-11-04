import { Field, ObjectType } from "@nestjs/graphql";
import { IsOptionalNumberColumn } from "server/main/decorators/columns/isOptionalnumberColumn.decorator";
import { IsRequiredStringColumn } from "server/main/decorators/columns/isRequiredStringColumn.decorator";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}