import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { User } from './user';

@Injectable()
export class AuthService {

  user$: Observable<User>;
  authState: any = null;


  usersCollection: AngularFirestoreCollection<User>;
  users$: Observable<User[]>;


  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {

    this.getAuthUsersListe();
    //// Get auth data, then get firestore user document || null
    this.user$ = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null)
        }
      })
  }

  // Récupère liste de tous les utilisateurs pouvant se connecter (depuis firebase console "authentification")

  getAuthUsersListe() {
    this.usersCollection = this.afs.collection('users');
    this.users$ = this.usersCollection.valueChanges();
  }


  ///// Social login/register
  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user
        this.updateUserData()
        this.router.navigate(['/home']);
      })
  }

  //// Anonymous Auth ////
  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        this.authState = user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  ///// Login/Signup Google //////
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLoginGoogle(provider);
  }

  private oAuthLoginGoogle(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user
        this.updateUserData()
        this.router.navigate(['/home']);
      })
  }

  ///// Login with email/password //////
  emailPasswordLogin(email, pwd) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, pwd)
      .then((user) => {
        this.authState = user
        console.log(this.authState)
        this.updateUserData()
      })
      .catch(error => {
        console.log(error)
      });
  }

  ///// Signup with email && password
  emailSignUp(email: string, password: string, name: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
        this.updateUserData(name)
      })
      .catch(error => console.log(error));
  }

  ///// Reset password
  sendPasswordResetEmail(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
      .then((user) => {
        console.log('le mail reset password a bien été envoyé');
        return true;
      })
      .catch(error => console.log(error));
  }

  ///// Deconnection
  signOut() {
    this.afAuth.auth.signOut();
    this.authState = null;
    this.router.navigate(['']);
  }

  ///// Mise à jour utilisateur -- @todo revoir pour connection social
  private updateUserData(name = null) {
    //console.log(this.authState);
    // Sets user data to firestore on login
    let now: Date = new Date(); // ne pas mettre directement new Date() dans json user plus bas
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.authState.uid}`);
    this.user$.subscribe(userInDb => {
      if (userInDb) {
        const data: User = {
          uid: this.authState.uid,
          dateAdded: userInDb.dateAdded,
          dateUpdated: now,
          lastLogin: now,
          nom: name ? name : this.authState.displayName !== null ? this.authState.displayName : userInDb.nom,
          email: this.authState.email,
          roles: {
            subscriber: userInDb.hasOwnProperty('roles') && userInDb.roles.hasOwnProperty('subscriber') ? userInDb.roles.subscriber : true,
            editor: userInDb.hasOwnProperty('roles') && userInDb.roles.hasOwnProperty('editor') ? userInDb.roles.editor : false,
            admin: userInDb.hasOwnProperty('roles') && userInDb.roles.hasOwnProperty('admin') ? userInDb.roles.admin : false
          }
        }
        return userRef.set(data, { merge: true })
      }
      else {
        console.log('on a pas de userindb');
        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        const data: User = {
          uid: this.authState.uid,
          dateAdded: now,
          dateUpdated: now,
          lastLogin: now,
          avatar: "",
          nom: name ? name : this.authState.displayName !== null ? this.authState.displayName : userInDb.nom,
          email: this.authState.email,
          roles: {
            subscriber: true,
            editor: false,
            admin: false
          }
        }
        return userRef.set(data, { merge: true })
      }
    });
  }

  /**
   * ACL
   */

  ///// Role-based Authorization //////
  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }

  canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true
      }
    }
    return false
  }




}