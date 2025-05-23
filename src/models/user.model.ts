export interface User {
  id: number;
  email: string;
  password: string;
}

export let users: User[] = [];