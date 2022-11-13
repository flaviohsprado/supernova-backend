import { Field, InputType } from '@nestjs/graphql';
import { IsRequiredString } from "../../../main/decorators/validators/isRequiredString.decorator";
import { IsOptionalString } from "../../../main/decorators/validators/isOptionalString.decorator";
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { CreateFileDTO } from '../file/file.dto';

@InputType()
export class CreateUserDTO {
  @IsRequiredString()
  public username: string;

  @IsOptionalString()
  public email: string;

  @IsRequiredString()
  public password: string;
}

@InputType()
export class UpdateUserDTO {
  @IsOptionalString()
  public username: string;

  @IsOptionalString()
  public email: string;

  @IsOptionalString()
  public password?: string;
}
