import { InputType } from '@nestjs/graphql';
import { uuid } from 'uuidv4';
import { IsOptionalString } from "../../../main/decorators/validators/isOptionalString.decorator";
import { IsRequiredString } from "../../../main/decorators/validators/isRequiredString.decorator";
import { CreateFileDTO } from '../file/file.dto';

@InputType()
export class CreateUserDTO {
  @IsOptionalString()
  public id?: string;

  @IsRequiredString()
  public username: string;

  @IsOptionalString()
  public email: string;

  @IsRequiredString()
  public password: string;

  @IsOptionalString()
  public file?: CreateFileDTO;

  constructor(props: CreateUserDTO) {
    Object.assign(this, props);
    this.id = uuid();
  }
}

@InputType()
export class UpdateUserDTO {
  @IsOptionalString()
  public username?: string;

  @IsOptionalString()
  public email?: string;

  @IsOptionalString()
  public password?: string;

  @IsOptionalString()
  public file?: CreateFileDTO;
}
