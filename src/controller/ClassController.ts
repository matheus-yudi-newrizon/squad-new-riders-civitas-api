import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { Class } from '../entities/Class';
import { School } from '../entities/School';
import { BadRequestError } from '../errors/BadRequestError';
import { CreateClassDTO } from '../interfaces/CreateClassDTO';
import { ICreateClassResponse } from '../interfaces/CreateClassResponse';

export class ClassController {
  public async createClass(req: Request, res: Response): Promise<Response<ICreateClassResponse>> {
    const createClassDTO = new CreateClassDTO();
    createClassDTO.name = req.body.name;
    createClassDTO.schoolYear = req.body.schoolYear;
    createClassDTO.schoolShift = req.body.schoolShift;
    createClassDTO.educationType = req.body.educationType;

    const errors = await validate(createClassDTO);
    if (errors.length > 0) {
      const validationErrors = errors.map(err => Object.values(err.constraints)).flat();
      throw new BadRequestError(`Erro de validação: ${validationErrors.join('; ')}`);
    }

    const schoolId = req.schoolId;

    const schoolRepository = MysqlDataSource.getRepository(School);
    const school = await schoolRepository.findOne({ where: { id: schoolId } });

    if (!school) {
      return res.status(404).json({ message: 'Escola não encontrada.' });
    }

    const classRepository = MysqlDataSource.getRepository(Class);

    const newClass = classRepository.create({ ...createClassDTO, school });

    await classRepository.save(newClass);

    return res.status(200).json({ message: 'Cadastro realizado com sucesso.' });
  }
}
