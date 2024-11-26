import { IEvaluationReviews, IEvaluationStudent } from './index';
export interface IEvaluationData {
  id: number;
  date: string;
  student: IEvaluationStudent;
  reviews: IEvaluationReviews;
  teacherComments: string;
}
