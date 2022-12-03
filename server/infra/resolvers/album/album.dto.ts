import { InputType } from '@nestjs/graphql';
import { IsOptionalString } from 'server/main/decorators/validators/isOptionalString.decorator';
import { IsRequiredDate } from 'server/main/decorators/validators/isRequiredDate.decorator';
import { IsRequiredString } from 'server/main/decorators/validators/isRequiredString.decorator';
import { uuid } from 'uuidv4';
import { CreateFileDTO } from '../file/file.dto';

@InputType()
export class CreateAlbumDTO {
	@IsOptionalString()
	public id?: string;

	@IsRequiredString()
	public artistId: string;

	@IsRequiredString()
	public title: string;

	@IsRequiredDate()
	public releaseDate: Date;

	@IsOptionalString()
	public file?: CreateFileDTO;

	constructor(props: CreateAlbumDTO) {
		Object.assign(this, props);
		this.id = uuid();
	}
}

@InputType()
export class UpdateAlbumDTO {
	@IsRequiredString()
	public title: string;

	constructor(props: UpdateAlbumDTO) {
		Object.assign(this, props);
	}
}
