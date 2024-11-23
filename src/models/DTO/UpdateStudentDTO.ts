import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsCPF, IsDocumentValid, IsValidClass } from '../../utils';

export class UpdateStudentDTO {
  @IsOptional()
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @MaxLength(50, { message: 'O campo nome deve ter no máximo 50 caracteres.' })
  readonly fullName?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo RG ou CPF do estudante é obrigatório.' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsDocumentValid()
  readonly document?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo número de matrícula é obrigatório.' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @MaxLength(20, { message: 'O campo número de matrícula deve ter no máximo 20 caracteres.' })
  readonly registrationNumber?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo turma é obrigatório' })
  @IsValidClass()
  readonly studentClass?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O campo CPF do responsável é obrigatório' })
  @IsString({ message: 'O campo CPF do responsável deve ser uma string.' })
  @IsCPF()
  readonly cpfGuardian?: string;
}
