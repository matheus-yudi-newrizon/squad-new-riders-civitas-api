import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Container } from 'typedi';
import { ClassRepository } from '../../repositories/ClassRepository';

@ValidatorConstraint({ async: true })
export class IsValidClassConstraint implements ValidatorConstraintInterface {
  private classRepository: ClassRepository;

  constructor() {
    this.classRepository = Container.get(ClassRepository);
  }

  async validate(className: string): Promise<boolean> {
    if (!className) return false;
    const classEntity = await this.classRepository.findByName(className);
    return !!classEntity;
  }

  defaultMessage(): string {
    return 'A turma informada não existe.';
  }
}

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
