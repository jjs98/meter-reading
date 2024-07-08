import { User } from './../api/models/user';
import { Token } from '../models/Token.type';

export function mapTokenToUser(token: Token | undefined): User | undefined {
  if (!token) return undefined;
  return {
    id: Number(token.nameid),
    username: token.unique_name,
    password: '',
    email: token.email,
    firstName: token.given_name,
    lastName: token.family_name,
  };
}
