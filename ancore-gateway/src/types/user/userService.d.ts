export type TLogin = 'Auth0' | 'Simple'
export interface ILogin {
  type: TLogin;
  email: string;
  password: string;
  image?: string;
}