export interface IPayloadLogin {
  id?: number;
  teacherId?: number;
  studentId?: number;
  classId?: number;
  className?: string;
  email?: string;
  registrationNumber?: string;
  schoolId: number;
  schoolName?: string;
  role: 'admin' | 'teacher' | 'guardian';
}
