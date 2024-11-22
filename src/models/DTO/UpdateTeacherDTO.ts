import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsCPF, IsValidClass } from '../../utils/validators';

export class UpdateTeacherDTO {
  @IsOptional()
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @MaxLength(50, { message: 'O campo nome deve ter no máximo 50 caracteres.' })
  readonly fullName?: string;

  @IsOptional()
  @IsString({ message: 'O campo CPF deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo CPF é obrigatório.' })
  @IsCPF({ message: 'CPF inválido, digite novamente.' })
  readonly cpf?: string;

  @IsOptional()
  @IsString({ message: 'O campo registro do professor deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo registro do professor é obrigatório.' })
  @MaxLength(20, { message: 'O campo registro deve ter no máximo 20 caracteres.' })
  readonly registrationNumber?: string;

  @IsOptional()
  @IsArray({ message: 'O campo turmas deve ser um array.' })
  @IsNotEmpty({ message: 'O campo turmas é obrigatório.' })
  @ArrayNotEmpty({ message: 'O campo turmas não pode estar vazio.' })
  @IsInt({ each: true, message: 'Cada turma deve ser identificada por um número.' })
  @IsValidClass({ each: true })
  readonly classes?: number[];
}
