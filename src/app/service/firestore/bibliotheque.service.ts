import { Injectable } from "@angular/core";
import { AuthService } from "./../../core/auth.service";
import * as firebase from "firebase/app";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from "rxjs/Observable";
import { User } from "./../../core/user";
import { UsersService } from "./../../service/firestore/users.service";
import { UserBibliotheque } from "./../../interface/UserBibliotheque";
import { environment } from '../../../environments/environment';
import "rxjs/add/operator/map";

@Injectable()

export class BibliothequeService {
  documentsCollection: AngularFirestoreCollection<UserBibliotheque>;
  userDocumentsCollection: AngularFirestoreCollection<UserBibliotheque>;
  userDocuments: Observable<UserBibliotheque[]>;

  constructor(
    public auth: AuthService,
    public UserService: UsersService,
    public afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {

    // Récupération reference de tous les documents
    this.documentsCollection = this.afs.collection(environment.app_config.firestore.collection.bibliotheque)

    // A | Récupération reference des documents de l'utilisateur connecté
    this.auth.user$.subscribe(userConnected => {
      this.UserService.getUserByUid(userConnected.uid).subscribe(user => {
        //console.log(user.uid)
        this.userDocumentsCollection = this.afs.collection(environment.app_config.firestore.collection.bibliotheque, ref => {
          return ref.where('userId', '==', user.uid)
        });
      });
    });
  }

  // A | Récupération reference des documents de l'utilisateur connecté ET recupération du tableau storage userDocumentStorage
  getUserConnectedDocuments() {
    // 1ère méthode
    this.userDocuments = this.userDocumentsCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as UserBibliotheque;
        var storageRef = this.afStorage.ref(data.fileStorageFullPath);
        storageRef.getMetadata().subscribe(storeData => {
          data.storage = storeData;
        });
        data.uid = a.payload.doc.id;
        return data;
      });
    });
    //console.log(this.userDocumentStorageRes)
    return this.userDocuments;
  }


  
}
