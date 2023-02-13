import { Session } from 'express-session'

declare module 'express-session' {
 interface Session {
    userId: string;
    username: string;
    logged: boolean;
  }
}