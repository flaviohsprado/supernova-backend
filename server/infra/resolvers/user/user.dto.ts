import { IsOptionalStringColumn } from '../../../main/decorators/columns/isOptionalStringColumn.decorator';
import { IsRequiredStringColumn } from '../../../main/decorators/columns/isRequiredStringColumn.decorator';

export class CreateUserDTO {
  @IsRequiredStringColumn()
  public username: string;

  @IsOptionalStringColumn()
  public email: string;

  @IsRequiredStringColumn()
  public password: string;
}

export class UpdateUserDTO {
  @IsOptionalStringColumn()
  public username: string;

  @IsOptionalStringColumn()
  public email: string;

  @IsOptionalStringColumn()
  public password: string;
}
