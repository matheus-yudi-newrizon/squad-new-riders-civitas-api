import { IADIReviews, IADIStudent } from './index';
export interface IADIData {
  id: number;
  date: string;
  student: IADIStudent;
  reviews: IADIReviews;
  teacherComments: string;
}
