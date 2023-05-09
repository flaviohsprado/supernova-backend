import { ObjectType } from '@nestjs/graphql';
import { IsRequiredString } from '../../main/decorators/validators/isRequiredString.decorator';

@ObjectType()
export class AuthPresenter {
	@IsRequiredString()
	public accessToken: string;

	constructor(auth: AuthPresenter) {
		Object.assign(this, auth);
	}
}
