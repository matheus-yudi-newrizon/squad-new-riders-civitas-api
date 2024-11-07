import { IsNotEmpty, IsString, MaxLength, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { IsCPF } from '../../utils/validators/cpfValidator';
import { IsValidClass } from '../../utils/validators/classExistsValidator';

export class CreateTeacherDTO {
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @MaxLength(50, { message: 'O campo nome deve ter no máximo 50 caracteres.' })
  readonly fullName: string;

  @IsNotEmpty({ message: 'O campo CPF é obrigatório.' })
  @IsString({ message: 'O campo CPF deve ser uma string.' })
  @IsCPF()
  readonly cpf: string;

  @IsNotEmpty({ message: 'O campo registro do professor é obrigatório.' })
  @IsString({ message: 'O campo registro do professor deve ser uma string.' })
  @MaxLength(20, { message: 'O campo registro deve ter no máximo 20 caracteres.' })
  readonly registrationNumber: string;

  @IsNotEmpty({ message: 'O campo turmas é obrigatório.' })
  @IsArray({ message: 'O campo turmas deve ser um array.' })
  @ArrayNotEmpty({ message: 'O campo turmas não pode estar vazio.' })
  @IsInt({ each: true, message: 'Cada turma deve ser identificada por um número.' })
  @IsValidClass({ each: true })
  readonly classes: number[];
}
