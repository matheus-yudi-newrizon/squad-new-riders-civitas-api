import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { Class } from '../entities/Class';
import { BadRequestError } from '../errors/BadRequestError';
import { CreateClassDTO } from '../interfaces/CreateClassDTO';
import { ICreateClassResponse } from '../interfaces/CreateClassResponse';

export class ClassController {
  /**
   * @swagger
   * /classes/create:
   *   post:
   *     summary: Cadastrar uma nova turma
   *     description: "Este endpoint permite criar uma nova turma com os campos `name`, `schoolYear`, `schoolShift`, e `educationType`."
   *     tags: [Classes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: "O nome da turma."
   *               schoolYear:
   *                 type: string
   *                 description: "O ano letivo (ex: 1st year, 2nd year)."
   *               schoolShift:
   *                 type: string
   *                 description: "O turno da turma (Morning, Afternoon, Night)."
   *               educationType:
   *                 type: string
   *                 description: "O tipo de ensino (Nursery, Preschool, etc.)."
   *     responses:
   *       200:
   *         description: "Cadastro realizado com sucesso."
   *       400:
   *         description: "Erro de validação."
   *       500:
   *         description: "Erro interno no servidor."
   */
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

    const classRepository = MysqlDataSource.getRepository(Class);

    const newClass = classRepository.create(createClassDTO);
    await classRepository.save(newClass);

    return res.status(200).json({ message: 'Cadastro realizado com sucesso.' });
  }
}
