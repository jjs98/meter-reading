export interface Token {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname': string;
  role: string[];
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
  tokenString: string;
}
