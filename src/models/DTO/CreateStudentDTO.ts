import { IsAlphanumeric, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { IsCPF, IsDocumentValid, IsValidClass } from '../../utils';

export class CreateStudentDTO {
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @MaxLength(50, { message: 'O campo nome deve ter no máximo 50 caracteres.' })
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, { message: 'Por favor, insira um nome válido' })
  readonly fullName: string;

  @IsNotEmpty({ message: 'O campo RG ou CPF do estudante é obrigatório.' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsDocumentValid()
  readonly document: string;

  @IsAlphanumeric(undefined, { message: 'O campo número de matrícula deve conter apenas letras e números.' })
  @IsNotEmpty({ message: 'O campo número de matrícula é obrigatório.' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @MaxLength(20, { message: 'O campo número de matrícula deve ter no máximo 20 caracteres.' })
  readonly registrationNumber: string;

  @IsNotEmpty({ message: 'O campo turma é obrigatório' })
  @IsValidClass()
  readonly studentClass: string;

  @IsNotEmpty({ message: 'O campo CPF do responsável é obrigatório' })
  @IsString({ message: 'O campo CPF do responsável deve ser uma string.' })
  @IsCPF()
  readonly cpfGuardian: string;
}
