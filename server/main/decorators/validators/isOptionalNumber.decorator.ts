import { applyDecorators } from '@nestjs/common';
import { IsNumber } from 'class-validator';

export const IsOptionalNumber = () => {
  return applyDecorators(IsNumber({}));
};
