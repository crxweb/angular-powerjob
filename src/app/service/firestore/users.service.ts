import { Injectable } from "@angular/core";
import * as firebase from "firebase/app";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { User } from "./../../core/user";
import { environment } from '../../../environments/environment';
import "rxjs/add/operator/map";

@Injectable()
export class UsersService {

  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  user: Observable<User>;
  userDoc: AngularFirestoreDocument<User>;
  userCollection: AngularFirestoreCollection<User>;
  userSearch: User[];
  userSearchResult: Observable<Boolean>;

  constructor(public afs: AngularFirestore) {
    this.usersCollection = this.afs.collection(environment.app_config.firestore.collection.users);
  }

  getUsers() {
    this.users = this.usersCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as User;
        data.uid = a.payload.doc.id;
        return data;
      });
    });
    return this.users;
  }

  isExistingUserMail(email){
    let collref = this.afs.collection(environment.app_config.firestore.collection.users).ref;
    let queryref = collref.where('email', '==', email);
    queryref.get().then((snapShot) => {
      if (snapShot.empty) {
        return false;
      }
      else {
        return true;
      }
      /*
      if(this.userSearchResult){
        console.log('email existe')
        return Observable.of(true);
      }
      else {
        console.log('email existe pas hein!');
        return Observable.of(false);
      }*/
    }).then(res => {
      console.log(res)
      this.userSearchResult = res ? Observable.of(true) : Observable.of(false);
      //console.log(this.userSearchResult.subscribe(data));
      //return Observable.of(true);

      //return res ? Observable.of(true) : Observable.of(false)

    });
    console.log(this.userSearchResult);
    
    //console.log(this.userSearchResult);
    //console.log(this.userSearchResult)
    //return this.userSearchResult ? Observable.of(true) : Observable.of(false);
    
    /*
    let collref = this.afs.collection('users').ref;
    let queryref = collref.where('email', '==', email);
    queryref.get().then((snapShot) => {

      this.userSearchResult = snapShot.empty ? false : true;
      return this.userSearchResult;
    })
    if(this.userSearch){
      return Observable.of(true);
    }
    else {
      return Observable.of(false);
    }
    */
  }

  returnBooleanObservable(bool): Observable<boolean> {
    return Observable.of(true)
  }

  emailCheck(email){
    let collref = this.afs.collection(environment.app_config.firestore.collection.users).ref;
    let queryref = collref.where('email', '==', email);
    queryref.get().then((snapShot) => {
      if (snapShot.empty) {
        // email libre
        console.log('ok email dispo');
        return null;
      }
      else {
        // email déjà pris
        console.log('email est deja enregistre')
        return { emailTaken: true }
      }
    })
  }
  
  isExistingUserByEmail(email: string){
    //console.log('email recherche : '+email);
    this.getUsers().subscribe(users => {
      this.userSearch = users;
      //console.log(this.userSearch);
      let search = this.userSearch.find(item => item.email === email);
      //console.log('search',search);
      return search ? true : false;
    });
  }

  
  addUser(user: User) {
    this.usersCollection.add(user);
  }

  updateUser(user: User) {
    //this.userDoc = this.afs.doc(`users/${user.uid}`);
    this.userDoc = this.afs.doc(`${environment.app_config.firestore.collection.users}/${user.uid}`);
    this.userDoc.update(user);
  }

  updateRole(user, role){
    console.log('mise à jour des roles')
    let roles = {}
    roles[role] = !user.roles[role];
    //const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`${environment.app_config.firestore.collection.users}/${user.uid}`);
    let data = {
      roles: roles
    }
    userRef.set(data, { merge: true });
  }
  
  deleteUser(user: User) {
    //this.userDoc = this.afs.doc(`users/${user.uid}`);
    this.userDoc = this.afs.doc(`${environment.app_config.firestore.collection.users}/${user.uid}`);
    this.userDoc.delete().catch(error => console.log(error));
  }

  deleteUserByEmail(user: User) {
    let collref = this.afs.collection(environment.app_config.firestore.collection.users).ref;
    let queryref = collref.where('email', '==', user.email);
    queryref.get().then((snapShot) => {
      if (!snapShot.empty) {
        console.log(snapShot);
        console.log('on tien utilisateur par email');
        snapShot.forEach((doc) => {
          console.log(doc);
      });
      }
    })
  }

  // Si fonctionne faire une methode commune
  getUserByUid(uid){
    this.userDoc = this.afs.doc(`${environment.app_config.firestore.collection.users}/${uid}`);
    this.user = this.userDoc.valueChanges();
    return this.user;
  }
  

}
