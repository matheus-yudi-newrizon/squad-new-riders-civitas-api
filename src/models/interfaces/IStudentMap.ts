export interface IStudentMap {
  id: number;
  fullName: string;
  document: string;
  registrationNumber: string;
  cpfGuardian: string;
  studentClass: {
    id: number;
    name: string;
    schoolYear: string;
    schoolShift: string;
    educationType: string;
  };
}
