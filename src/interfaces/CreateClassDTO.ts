import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SchoolYear } from '../enums/SchoolYear';
import { SchoolShift } from '../enums/SchoolShift';
import { EducationType } from '../enums/EducationType';

export class CreateClassDTO {
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  name: string;

  @IsEnum(SchoolYear, { message: 'O ano letivo informado é inválido.' })
  schoolYear: SchoolYear;

  @IsEnum(SchoolShift, { message: 'O turno informado é inválido.' })
  schoolShift: SchoolShift;

  @IsEnum(EducationType, { message: 'O tipo de ensino informado é inválido.' })
  educationType: EducationType;
}
