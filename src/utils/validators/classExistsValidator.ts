import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Container } from 'typedi';
import { ClassRepository } from '../../repositories/ClassRepository';

/**
 * Classe de validação que verifica se a turma fornecida é válida.
 *
 * Esta classe utiliza o `ClassRepository` para verificar se a turma existe no banco de dados.
 */
@ValidatorConstraint({ async: true })
export class IsValidClassConstraint implements ValidatorConstraintInterface {
  private classRepository: ClassRepository;

  constructor() {
    this.classRepository = Container.get(ClassRepository);
  }

  /**
   * Valida se o nome da turma fornecido existe no banco de dados.
   *
   * @param className - O nome da turma que será verificado.
   * @returns `true` se a turma existir, caso contrário, `false`.
   */
  async validate(className: string): Promise<boolean> {
    if (!className) return false;
    const classEntity = await this.classRepository.findByName(className);
    return !!classEntity;
  }

  /**
   * Mensagem de erro padrão retornada caso a validação falhe.
   *
   * @returns Uma string indicando que a turma informada não existe.
   */
  defaultMessage(): string {
    return 'A turma informada não existe.';
  }
}

/**
 * Decorator de validação para verificar se a turma fornecida é válida.
 *
 * @param validationOptions - Opções de validação adicionais que podem ser fornecidas.
 * @returns Uma função que registra o decorator de validação.
 */
export function IsValidClass(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidClassConstraint
    });
  };
}
