import { InputType } from '@nestjs/graphql';
import { IsOptionalNumber } from 'server/main/decorators/validators/isOptionalNumber.decorator';
import { IsOptionalString } from 'server/main/decorators/validators/isOptionalString.decorator';
import { IsRequiredNumber } from 'server/main/decorators/validators/isRequiredNumber.decorator';
import { IsRequiredString } from 'server/main/decorators/validators/isRequiredString.decorator';
import { uuid } from 'uuidv4';
import { CreateFileDTO } from './file.dto';

@InputType()
export class CreateMusicDTO {
	@IsOptionalString()
	public id?: string;

	@IsRequiredString()
	public albumId: string;

	@IsRequiredString()
	public title: string;

	@IsRequiredNumber()
	public duration: number;

	@IsOptionalString()
	public file?: CreateFileDTO;

	constructor(props: CreateMusicDTO) {
		Object.assign(this, props);
		this.id = uuid();
	}
}

@InputType()
export class UpdateMusicDTO {
	@IsOptionalString()
	public albumId?: string;

	@IsOptionalString()
	public title?: string;

	@IsOptionalNumber()
	public duration?: number;

	@IsOptionalString()
	public file?: CreateFileDTO;

	constructor(props: UpdateMusicDTO) {
		Object.assign(this, props);
	}
}
