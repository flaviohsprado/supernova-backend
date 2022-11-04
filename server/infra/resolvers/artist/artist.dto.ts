import { InputType } from "@nestjs/graphql";
import { IsRequiredString } from "server/main/decorators/validators/isRequiredString.decorator";

@InputType()
export class CreateArtistDTO {
    @IsRequiredString()
    public name: string;
}

@InputType()
export class UpdateArtistDTO {
    @IsRequiredString()
    public name: string;
}