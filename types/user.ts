// types/user.ts

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type Session = {
  user: User;
};