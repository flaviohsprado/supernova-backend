import { IsRequiredString } from '../../../main/decorators/validators/isRequiredString.decorator';

export class AuthPresenter {
  @IsRequiredString()
  public accessToken: string;

  constructor(auth: AuthPresenter) {
    Object.assign(this, auth);
  }
}
