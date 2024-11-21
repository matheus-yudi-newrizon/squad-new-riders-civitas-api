export interface IPayloadLogin {
  id?: number;
  teacherId?: number;
  email?: string;
  registrationNumber?: string;
  schoolId: number;
  schoolName?: string;
  role: 'admin' | 'teacher';
}
