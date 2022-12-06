import { InputType } from '@nestjs/graphql';
import { IsOptionalBoolean } from 'server/main/decorators/validators/isOptionalBoolean.decorator';
import { IsOptionalString } from 'server/main/decorators/validators/isOptionalString.decorator';
import { IsRequiredBoolean } from 'server/main/decorators/validators/isRequiredBoolean.decorator';
import { IsRequiredString } from 'server/main/decorators/validators/isRequiredString.decorator';

@InputType()
export class CreatePlaylistDTO {
	@IsRequiredString()
	public userId: string;

	@IsRequiredString()
	public title: string;

	@IsRequiredBoolean()
	public isPublic: boolean;

	constructor(props: CreatePlaylistDTO) {
		Object.assign(this, props);
	}
}

@InputType()
export class UpdatePlaylistDTO {
	@IsOptionalString()
	public title?: string;

	@IsOptionalBoolean()
	public isPublic?: boolean;

	constructor(props: UpdatePlaylistDTO) {
		Object.assign(this, props);
	}
}
