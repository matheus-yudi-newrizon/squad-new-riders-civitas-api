import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

/**
 * Classe de validação personalizada que verifica se o valor fornecido é um CPF ou RG válido.
 *
 * Esta classe implementa a `ValidatorConstraintInterface` do `class-validator` para aplicar uma
 * validação customizada em propriedades decoradas com `@IsDocumentValid`.
 *
 * @class IsDocumentValidConstraint
 */
@ValidatorConstraint({ async: false })
class IsDocumentValidConstraint implements ValidatorConstraintInterface {
  /**
   * Método de validação para CPF e RG.
   *
   * Verifica se o valor fornecido é um CPF ou RG válido. Um CPF válido passa pela validação
   * `cpf.isValid`, enquanto o RG é validado por meio de uma expressão regular para
   * correspondência com o padrão comum de RGs brasileiros.
   *
   * @param value - O valor a ser validado (CPF ou RG sem máscara).
   * @returns `true` se o valor for um CPF ou RG válido; caso contrário, `false`.
   */
  validate(value: string): boolean {
    const strippedValue: string = value.replace(/[.-]/g, '');
    const isValidCPF: boolean = cpf.isValid(strippedValue);
    const isValidRG = /^\d{7,9}$|^[A-Za-z]{1,2}\d{7}[0-9Xx]$/.test(strippedValue);

    return isValidCPF || isValidRG;
  }

  defaultMessage(): string {
    /**
     * Mensagem de erro padrão.
     *
     * Retorna uma mensagem de erro que será exibida quando a validação falhar.
     *
     * @returns A mensagem de erro padrão: "O documento do estudante é inválido. Verifique as informações digitadas".
     */
    return 'O documento do estudante é inválido. Verifique as informações digitadas';
  }
}

/**
 * Decorador de validação para CPF/RG válido.
 *
 * `@IsDocumentValid` é um decorador personalizado que verifica se uma propriedade de string
 * é um CPF ou RG válido, utilizando o validador `IsDocumentValidConstraint`.
 *
 * @param validationOptions - Opções opcionais de validação que podem ser fornecidas ao decorador.
 * @returns Uma função que registra o decorador personalizado com o `class-validator`.
 *
 * @example
 * ```typescript
 * class Student {
 *   @IsDocumentValid({ message: "O documento do estudante é inválido. Verifique as informações digitadas" })
 *   documento: string;
 * }
 * ```
 */
export function IsDocumentValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDocumentValidConstraint
    });
  };
}
