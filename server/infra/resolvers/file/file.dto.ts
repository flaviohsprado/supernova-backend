import { Field, InputType } from "@nestjs/graphql";
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { IsRequiredString } from "server/main/decorators/validators/isRequiredString.decorator";

@InputType()
export class CreateFileDTO {
    @IsRequiredString()
    ownerId: string;

    @IsRequiredString()
    ownerType: string;

    @IsRequiredString()
    fieldname: string;

    @IsRequiredString()
    originalname: string;

    @IsRequiredString()
    encoding: string;

    @IsRequiredString()
    mimetype: string;

    @IsRequiredString()
    key: string;

    @IsRequiredString()
    url: string;

    @Field(() => GraphQLUpload)
    buffer: Uint8Array;

    constructor(props: CreateFileDTO) {
        Object.assign(this, props);
    }
}