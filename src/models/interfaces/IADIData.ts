import { IADIReviews } from './IADIReviews';
import { IADIStudent } from './IADIStudent';

export interface IADIData {
  id: number;
  date: string;
  student: IADIStudent;
  reviews: IADIReviews;
  teacherComments: string;
}
