export interface IPayloadLogin {
  id: number;
  email?: string;
  registrationNumber?: string;
  schoolId: number;
  schoolName?: string;
  role: 'admin' | 'teacher';
}
