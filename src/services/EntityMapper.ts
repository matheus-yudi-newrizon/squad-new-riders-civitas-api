import { Evaluation, Student } from '../entities';
import { IEvaluationReviews, IEvaluationStudent, IStudentMap } from '../models';

export class EntityMapper {
  public static mapEvaluationStudent(evaluation: Evaluation): IEvaluationStudent {
    return {
      id: evaluation.student.id,
      fullName: evaluation.student.fullName,
      studentClass: evaluation.student.studentClass.name
    };
  }
  public static mapEvaluationReviews(evaluation: Evaluation): IEvaluationReviews {
    return {
      selfAwareness: evaluation.selfAwareness,
      empathy: evaluation.empathy,
      communication: evaluation.communication,
      teamwork: evaluation.teamwork,
      autonomy: evaluation.autonomy
    };
  }

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
}
