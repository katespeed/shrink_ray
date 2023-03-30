import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!
    authenticatedUser: {
      userId: string;
      userName: string;
      isPro: boolean;
      isAdmin: boolean;
    };
    isLoggedIn: boolean;
    // logInAttempts: number;
    logInTimeout: string;
  }
}
