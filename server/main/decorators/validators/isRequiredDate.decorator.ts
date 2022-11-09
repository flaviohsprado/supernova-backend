import { applyDecorators } from '@nestjs/common';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Field } from "@nestjs/graphql";

export const IsRequiredDate = () => {
    return applyDecorators(IsDate(), Field(), IsNotEmpty());
};