import { applyDecorators } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';

export const IsOptionalString = () => {
  return applyDecorators(
    IsOptional(),
    IsString(),
  );
};
