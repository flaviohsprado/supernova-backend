import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsNumber } from 'class-validator';

export const IsRequiredNumber = () => {
  return applyDecorators(IsNumber(), IsNotEmpty());
};
