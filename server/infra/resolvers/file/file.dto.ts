import { Field, InputType } from "@nestjs/graphql";
// @ts-ignore
import { GraphQLUpload } from "graphql-upload";
import { IsOptionalString } from "server/main/decorators/validators/isOptionalString.decorator";

@InputType()
export class CreateFileDTO {
    @IsOptionalString()
    ownerId?: string;

    @IsOptionalString()
    ownerType?: string;

    @IsOptionalString()
    fieldname?: string;

    @IsOptionalString()
    originalname?: string;

    @IsOptionalString()
    encoding?: string;

    @IsOptionalString()
    mimetype?: string;

    @IsOptionalString()
    key?: string;

    @IsOptionalString()
    url?: string;

    @Field(() => GraphQLUpload)
    buffer?: Uint8Array;

    constructor(props: CreateFileDTO) {
        Object.assign(this, props);
    }
}