import { IsEnum, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { EvaluationScore } from '../enums';

export class CreateEvaluationDTO {
  @IsNotEmpty({ message: 'O campo studentId é obrigatório.' })
  @IsInt({ message: 'O campo studentId deve ser um número inteiro.' })
  readonly studentId: number;

  @IsNotEmpty({ message: 'O campo selfAwareness é obrigatório.' })
  @IsEnum(EvaluationScore, { message: 'O campo selfAwareness deve ser um valor válido do enum EvaluationScore.' })
  readonly selfAwareness: EvaluationScore;

  @IsNotEmpty({ message: 'O campo empathy é obrigatório.' })
  @IsEnum(EvaluationScore, { message: 'O campo empathy deve ser um valor válido do enum EvaluationScore.' })
  readonly empathy: EvaluationScore;

  @IsNotEmpty({ message: 'O campo communication é obrigatório.' })
  @IsEnum(EvaluationScore, { message: 'O campo communication deve ser um valor válido do enum EvaluationScore.' })
  readonly communication: EvaluationScore;

  @IsNotEmpty({ message: 'O campo teamwork é obrigatório.' })
  @IsEnum(EvaluationScore, { message: 'O campo teamwork deve ser um valor válido do enum EvaluationScore.' })
  readonly teamwork: EvaluationScore;

  @IsNotEmpty({ message: 'O campo autonomy é obrigatório.' })
  @IsEnum(EvaluationScore, { message: 'O campo autonomy deve ser um valor válido do enum EvaluationScore.' })
  readonly autonomy: EvaluationScore;

  @IsNotEmpty({ message: 'O campo teacherComments é obrigatório.' })
  @IsString({ message: 'O campo teacherComments deve ser uma string.' })
  @MaxLength(3000, { message: 'O campo teacherComments deve ter no máximo 3000 caracteres.' })
  readonly teacherComments: string;
}
