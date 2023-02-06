import { Injectable } from '@angular/core';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  register(creds: {
    email: string;
    password: string;
  }): Promise<UserCredential> {
    // try {

    // } catch (error) {

    // }
    return createUserWithEmailAndPassword(
      this.auth,
      creds.email,
      creds.password
    );
  }

  login(creds: { email: string; password: string }): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, creds.email, creds.password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
