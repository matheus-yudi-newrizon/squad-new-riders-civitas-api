import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { Class } from '../entities/Class';
import { School } from '../entities/School';
import { BadRequestError } from '../errors/BadRequestError';
import { ICreationSucessResponse } from '../models/interfaces/ICreationSucessResponse';

export class ClassController {
  /**
   * @swagger
   * /classes/create:
   *   post:
   *     summary: Cadastrar uma nova turma
   *     description: "Este endpoint permite criar uma nova turma associada a uma escola com os campos `name`, `schoolYear`, `schoolShift`, e `educationType`."
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
   *       201:
   *         description: "Cadastro realizado com sucesso."
   *       400:
   *         description: "Erro de validação."
   *       404:
   *         description: "Escola não encontrada."
   *       500:
   *         description: "Erro interno no servidor."
   */
  public async createClass(req: Request, res: Response): Promise<Response<ICreationSucessResponse>> {
    const schoolId = res.locals.schoolId;

    const classRepository = MysqlDataSource.getRepository(Class);

    const existingClass = await classRepository.findOne({
      where: {
        school: { id: schoolId },
        name: req.body.name,
        schoolYear: req.body.schoolYear,
        schoolShift: req.body.schoolShift,
        educationType: req.body.educationType
      }
    });

    if (existingClass) {
      throw new BadRequestError('O apelido da turma já existe para as seleções feitas.');
    }

    const schoolRepository = MysqlDataSource.getRepository(School);
    const school = await schoolRepository.findOne({ where: { id: schoolId } });

    if (!school) {
      throw new BadRequestError('Escola não encontrada.');
    }

    const newClass = classRepository.create({ ...req.body, school });
    await classRepository.save(newClass);

    return res.status(201).json({ message: 'Cadastro realizado com sucesso.' });
  }
}
