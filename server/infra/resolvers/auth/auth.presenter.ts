import { IsRequiredString } from '../../../main/decorators/validators/isRequiredString.decorator';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPresenter {
	@IsRequiredString()
	public accessToken: string;

	constructor(auth: AuthPresenter) {
		Object.assign(this, auth);
	}
}
