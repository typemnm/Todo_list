export interface User {
  _id: string;
  email: string;
}

export interface AuthData {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}
