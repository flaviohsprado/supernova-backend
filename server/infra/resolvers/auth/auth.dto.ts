import { InputType } from '@nestjs/graphql';
import { IsRequiredString } from '../../../main/decorators/validators/isRequiredString.decorator';

@InputType()
export class AuthDTO {
	@IsRequiredString()
	public username: string;

	@IsRequiredString()
	public password: string;

	constructor(props: AuthDTO) {
		Object.assign(this, props);
	}
}
