import { Role } from "../roles/Role.Model";

export class User{
    Username!: string;
    Password!: string;
    FirstName!: string;
    Email!: string;
    IsActive: boolean = true;
    Role!: Role;
    CreatedDate: Date = new Date();

}
