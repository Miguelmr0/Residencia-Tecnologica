export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Session {
  user: SessionUser;
  expiresAt: number; // milissegundos desde 1970, o mesmo formato de Date.now()
}