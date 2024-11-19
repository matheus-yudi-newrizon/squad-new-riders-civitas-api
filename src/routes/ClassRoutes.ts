import { Router } from 'express';
import { Container } from 'typedi';
import { ClassController } from '../controller/ClassController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { validationMiddleware } from '../middlewares/validateMiddleware';
import { CreateClassDTO } from '../models/DTO/CreateClassDTO';

const classRoutes = Router();
const classController: ClassController = Container.get(ClassController);

/**
 * @route POST /classes/create
 * @description Rota para cadastro de uma nova turma, exigindo autenticação e validação dos dados.
 * @access Private
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware roleMiddleware(['admin']) - Restringe acesso a administradores.
 * @middleware validationMiddleware(CreateClassDTO) - Valida o payload com base no DTO fornecido.
 */
classRoutes.post('/create', authMiddleware, roleMiddleware(['admin']), validationMiddleware(CreateClassDTO), (req, res) =>
  classController.create(req, res)
);

/**
 * @route GET /classes
 * @description Rota para listar as turmas de uma escola com filtros opcionais de ano, turno e tipo de ensino.
 * @access Private
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware roleMiddleware(['admin']) - Restringe acesso a administradores.
 */
classRoutes.get('/', authMiddleware, roleMiddleware(['admin']), (req, res) => classController.listClasses(req, res));

/**
 * @route PUT /classes/:id
 * @description Rota para atualizar as informações de uma turma específica.
 * @param id - ID da turma a ser atualizada.
 * @access Private
 * @middleware authMiddleware - Garante que o usuário está autenticado.
 * @middleware roleMiddleware(['admin']) - Restringe acesso a administradores.
 * @middleware validationMiddleware - Valida os dados de entrada com o DTO de atualização.
 */
classRoutes.put('/:id', authMiddleware, roleMiddleware(['admin']), validationMiddleware(CreateClassDTO), (req, res) =>
  classController.updateClass(req, res)
);

/**
 * @route DELETE /classes/:id
 * @description Rota para deletar uma turma específica pelo seu ID.
 * @param id - ID da turma a ser deletada.
 * @access Private
 * @middleware authMiddleware - Garante que o usuário está autenticado
 * @middleware roleMiddleware(['admin']) - Restringe acesso a administradores.
 */
classRoutes.delete('/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => classController.deleteClass(req, res));

export default classRoutes;
