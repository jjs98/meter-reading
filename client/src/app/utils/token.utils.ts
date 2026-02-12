import { Token } from '../models/Token.type';
import { User } from '../models/user';

export function mapTokenToUser(token: Token | undefined): User | undefined {
  if (!token) return undefined;
  return {
    id: Number(
      token[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ]
    ),
    username:
      token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
    password: '',
    email:
      token[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ],
    firstName:
      token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
    lastName:
      token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
  };
}
