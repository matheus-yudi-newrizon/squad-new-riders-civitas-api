export interface ITeacherMap {
  id: number;
  fullName: string;
  cpf: string;
  teacherClasses: {
    class: {
      id: number;
    };
  }[];
  registrationNumber?: string;
}
