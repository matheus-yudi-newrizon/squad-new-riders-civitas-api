export interface IClassMap {
  id: number;
  name: string;
  schoolYear: string;
  schoolShift: string;
  educationType: string;
  school: {
    id: number;
    name: string;
    address: string;
  };
  students: {
    id: number;
    fullName: string;
    document: string;
    registrationNumber: string;
    cpfGuardian: string;
  }[];
  teacherClasses: {
    teacher: {
      id: number;
      fullName: string;
      cpf: string;
    };
  }[];
}
