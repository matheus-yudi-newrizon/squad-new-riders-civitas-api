export interface IPayloadLogin {
  id?: number;
  teacherId?: number;
  studentId?: number;
  email?: string;
  registrationNumber?: string;
  schoolId: number;
  schoolName?: string;
  role: 'admin' | 'teacher' | 'guardian';
}
