import { User } from "../users/User.Model";

export class Invoice{
    User!: User;
    Status: any;
    Total: any;
    CreatedDate: Date = new Date();
} 