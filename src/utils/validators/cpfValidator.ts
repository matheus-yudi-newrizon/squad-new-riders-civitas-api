import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

/**
 * Decorador @ValidatorConstraint para definir uma restrição de validação personalizada para CPF (Cadastro de Pessoas Físicas).
 * Esta classe implementa a interface ValidatorConstraintInterface.
 *
 * @class IsCPFConstraint
 * @implements {ValidatorConstraintInterface}
 *
 * @method validate
 * Valida se o valor fornecido é um número de CPF válido.
 *
 * @param {string} value - O valor a ser validado.
 * @returns {boolean} - Retorna true se o valor for um CPF válido, false caso contrário.
 *
 * @method defaultMessage
 * Fornece uma mensagem de erro padrão quando a validação falha.
 *
 * @returns {string} - A mensagem de erro padrão.
 */
@ValidatorConstraint({ async: false })
/**
 * Remove a máscara do valor fornecido e valida se é um CPF válido usando a biblioteca cpf-cnpj-validator.
 *
 * @param {string} value - O valor a ser validado.
 * @returns {boolean} - Retorna `true` se o valor for um CPF válido, `false` caso contrário.
 */
class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const strippedValue: string = value.replace(/[.-]/g, '');
    return cpf.isValid(strippedValue);
  }

  defaultMessage(): string {
    return 'CPF inválido. Verifique as informações digitadas';
  }
}

/**
 * Decorador customizado que valida se um CPF é válido
 *
 * @param validationOptions - Opções de validação opcionais para passar para o decorador.
 * @returns Uma função que registra o decorador de validação de CPF na propriedade alvo.
 */
export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: validationOptions?.message ? [validationOptions.message] : [],
      validator: IsCPFConstraint
    });
  };
}
