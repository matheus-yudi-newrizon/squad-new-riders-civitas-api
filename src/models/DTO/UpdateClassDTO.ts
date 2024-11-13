import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EducationType } from '../enums/EducationType';
import { SchoolShift } from '../enums/SchoolShift';
import { SchoolYear } from '../enums/SchoolYear';

export class UpdateClassDTO {
  @IsOptional()
  @IsString({ message: 'O campo nome deve ser uma string.' })
  readonly name?: string;

  @IsOptional()
  @IsEnum(SchoolYear, { message: 'O ano letivo informado é inválido.' })
  readonly schoolYear?: SchoolYear;

  @IsOptional()
  @IsEnum(SchoolShift, { message: 'O turno informado é inválido.' })
  readonly schoolShift?: SchoolShift;

  @IsOptional()
  @IsEnum(EducationType, { message: 'O tipo de ensino informado é inválido.' })
  readonly educationType?: EducationType;
}
