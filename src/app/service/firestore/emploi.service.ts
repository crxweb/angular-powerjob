import { Injectable } from "@angular/core";
import { AuthService } from "./../../core/auth.service";
import * as firebase from "firebase/app";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { User } from "./../../core/user";
import { UsersService } from "./../../service/firestore/users.service";
import { environment } from '../../../environments/environment';
import "rxjs/add/operator/map";

@Injectable()
export class EmploiService {

  user: User;
  emploiCollection: AngularFirestoreCollection<any>;
  critereDoc: AngularFirestoreDocument<any>;
  userCritere: Observable<any>;

  userSearchParamListe: Observable<any[]>;


  constructor(
    public auth: AuthService,
    public UserService: UsersService,
    public afs: AngularFirestore
  ) {
    
    this.auth.user$.subscribe(userConnected => {
      this.UserService.getUserByUid(userConnected.uid).subscribe(user => {
        //console.log(user.uid)
        this.user = user;
        this.emploiCollection = this.afs.collection("emploi/"+this.user.uid+"/criteres-recherche");
      });
    });
  }

  getCritereListe(){
    this.userSearchParamListe = this.emploiCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data();
        //console.log(data);
        return data;
      });
    });
    //console.log(this.userDocumentStorageRes)
    return this.userSearchParamListe;
  }
  
  getCritereById(idCritere){
    this.critereDoc = this.afs.doc("emploi/"+this.user.uid+"/criteres-recherche/"+idCritere);
    this.userCritere = this.critereDoc.valueChanges();
    return this.userCritere;
  }
}
