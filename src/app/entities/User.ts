import { Role } from '../enums/Role.enum';

export interface User {
  id : number;
  firstName : string;
  lastName : string;
  email : string;
  password : string;
  roles : Role[];
  enabled : boolean;
}

