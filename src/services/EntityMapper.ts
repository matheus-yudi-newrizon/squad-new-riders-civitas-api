import { Class, Evaluation, Student, Teacher } from '../entities';
import { IClassMap, IEvaluationReviews, IEvaluationStudent, IStudentMap, ITeacherMap } from '../models';

/**
 * Classe responsável por mapear entidades do domínio para modelos utilizados nas respostas das APIs.
 */
export class EntityMapper {
  /**
   * Mapeia uma entidade `Evaluation` para o modelo `IEvaluationStudent`.
   *
   * @param evaluation - A entidade de avaliação que será mapeada.
   * @returns Um objeto `IEvaluationStudent` contendo as informações do estudante relacionadas à avaliação.
   */
  public static mapEvaluationStudent(evaluation: Evaluation): IEvaluationStudent {
    return {
      id: evaluation.student.id,
      fullName: evaluation.student.fullName,
      studentClass: evaluation.student.studentClass.name
    };
  }

  /**
   * Mapeia os aspectos avaliados de uma entidade `Evaluation` para o modelo `IEvaluationReviews`.
   *
   * @param evaluation - A entidade de avaliação que será mapeada.
   * @returns Um objeto `IEvaluationReviews` contendo os aspectos da avaliação.
   */
  public static mapEvaluationReviews(evaluation: Evaluation): IEvaluationReviews {
    return {
      selfAwareness: evaluation.selfAwareness,
      empathy: evaluation.empathy,
      communication: evaluation.communication,
      teamwork: evaluation.teamwork,
      autonomy: evaluation.autonomy
    };
  }

  /**
   * Mapeia uma entidade `Student` para o modelo `IStudentMap`.
   *
   * @param student - A entidade do estudante que será mapeada.
   * @returns Um objeto `IStudentMap` contendo as informações do estudante.
   */
  public static mapStudent(student: Student): IStudentMap {
    return {
      id: student.id,
      fullName: student.fullName,
      document: student.document,
      registrationNumber: student.registrationNumber,
      cpfGuardian: student.cpfGuardian,
      studentClass: {
        id: student.studentClass.id,
        name: student.studentClass.name,
        schoolYear: student.studentClass.schoolYear,
        schoolShift: student.studentClass.schoolShift,
        educationType: student.studentClass.educationType
      }
    };
  }

  /**
   * Mapeia uma entidade `Class` para o modelo `IClassMap`.
   *
   * @param Class - A entidade da turma que será mapeada.
   * @returns Um objeto `IClassMap` contendo as informações da turma, incluindo estudantes e professores associados.
   */
  public static mapClass(Class: Class): IClassMap {
    return {
      id: Class.id,
      name: Class.name,
      schoolYear: Class.schoolYear,
      schoolShift: Class.schoolShift,
      educationType: Class.educationType,
      students: Class.students.map(student => ({
        id: student.id,
        fullName: student.fullName,
        document: student.document,
        registrationNumber: student.registrationNumber,
        cpfGuardian: student.cpfGuardian
      })),
      teacherClasses: Class.teacherClasses.map(teacherClass => ({
        teacher: {
          id: teacherClass.teacher.id,
          fullName: teacherClass.teacher.fullName,
          cpf: teacherClass.teacher.cpf
        }
      }))
    };
  }

  /**
   * Mapeia uma entidade `Teacher` para o modelo `ITeacherMap`.
   *
   * @param teacher - A entidade do professor que será mapeada.
   * @returns Um objeto `ITeacherMap` contendo as informações do professor e das turmas associadas.
   */
  public static mapTeacher(teacher: Teacher): ITeacherMap {
    return {
      id: teacher.id,
      fullName: teacher.fullName,
      cpf: teacher.cpf,
      teacherClasses: teacher.teacherClasses.map(teacherClass => ({
        class: {
          id: teacherClass.class.id
        }
      }))
    };
  }
}
