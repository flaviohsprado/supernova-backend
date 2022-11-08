import { InputType } from "@nestjs/graphql";
import { IsRequiredDate } from "server/main/decorators/validators/isRequiredDate.decorator";
import { IsRequiredString } from "server/main/decorators/validators/isRequiredString.decorator";

@InputType()
export class CreateAlbumDTO {
    @IsRequiredString()
    public artistId: string;

    @IsRequiredString()
    public title: string;

    @IsRequiredDate()
    public releaseDate: Date;
}

@InputType()
export class UpdateAlbumDTO {
    @IsRequiredString()
    public title: string;
}