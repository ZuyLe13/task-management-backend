export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
}

export let users: User[] = [];