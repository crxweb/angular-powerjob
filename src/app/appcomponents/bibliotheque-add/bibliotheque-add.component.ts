import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "./../../core/auth.service";
import { UsersService } from "./../../service/firestore/users.service";
/////
import { Injectable } from "@angular/core";
import * as firebase from "firebase/app";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { UserBibliotheque } from "./../../interface/UserBibliotheque";
import { User } from "./../../core/user";
import { BibliothequeService } from "./../../service/firestore/bibliotheque.service";
import "rxjs/add/operator/map";
/////

@Component({
  selector: 'app-bibliotheque-add',
  templateUrl: './bibliotheque-add.component.html',
  styleUrls: ['./bibliotheque-add.component.css']
})
export class BibliothequeAddComponent implements OnInit {
  upload_path = environment.app_config.upload_config.path.bibliotheque;
  upload_max_file_size = environment.app_config.upload_config.max_file_size.bibliotheque;
  upload_mime_type_allowed = environment.app_config.upload_config.mime_type_allowed.bibliotheque;
  ref;
  task;
  taskMetadata; // Meta data fichier téléchargé
  uploadProgress;
  uploadURL;
  isImage: boolean;
  deletedUpload: boolean; // suppression du fichier
  addOtherFile: boolean;

  // Erreurs
  preUploadError;
  uploadError: any;

  // Bibliothèque utilisateur
  user;
  userDocumentsCollection: AngularFirestoreCollection<UserBibliotheque>;
  userDocuments: Observable<any[]>;
  data$: Observable<UserBibliotheque[]>;
  userDocuments$: Observable<UserBibliotheque[]>;

  userBibliothequeCollection: AngularFirestoreCollection<UserBibliotheque>;

  userDocumentStorage = []; // tableau permettant de faire le lien avec le storage
  newDocLibelle: string;
  newDocTypeDocument: string;
  fileTypeOptions: any[];

  /*
  userDocumentsCollection: AngularFirestoreCollection<UserBibliotheque>;
  userDocuments: Observable<UserBibliotheque[]>;
*/

  constructor(
    public auth: AuthService,
    private UserService: UsersService,
    private BibliothequeService: BibliothequeService,
    private afStorage: AngularFireStorage,
    private router: Router,
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    // Récupération utilisateur connecté
    this.auth.user$.subscribe(userConnected => {
      this.UserService.getUserByUid(userConnected.uid).subscribe(user => {
        this.user = user;
        // Récupération des documents
        //this.data$ = this.BibliothequeService.getUserConnectedDocuments();
        //this.userDocuments$ = this.data$;
      });
    });

    // Form initialisation
    this.fileTypeOptions = [
      {value: "CV", text: "CV"},
      {value: "Lettre de motivation", text: "Lettre de motivation"},
      {value: "Candidature spontanée", text: "Candidature spontanée"},
      {value: "Pièce d'identité", text: "Pièce d'identité"}
    ];

  }

  addUploadToBibliotheque(){
    console.log(this.taskMetadata)
    let now: Date = new Date(); 
    const newDocument: UserBibliotheque = {
      documentAdded: now,
      //documentUpdated?: Date,
      documentType: this.newDocTypeDocument,
      documentLibelle: this.newDocLibelle,
      fileStorageContentType: this.taskMetadata.contentType,
      fileStorageFullPath: this.taskMetadata.fullPath,
      fileStorageName: this.taskMetadata.name,
      fileStorageOriginalName: this.taskMetadata.customMetadata.original_filename,
      fileStorageSize: this.taskMetadata.size,
      userId: this.user.uid
    }
    console.log(newDocument);
    this.addUserDocument(newDocument);
    
    //const newDocRef: AngularFirestoreDocument<any> = this.afs.doc("user_bibliotheque");
    //newDocRef.set(newDocument, { merge: true })
  }

  addUserDocument(userDoc: UserBibliotheque) {
    this.userBibliothequeCollection = this.afs.collection('users_bibliotheque');
    this.userBibliothequeCollection.add(userDoc).catch(error => {
      console.log(error)
    })
  }

  deleteBibliothequeDocument(docToDelete: UserBibliotheque){
    console.log('supprimer storage puis doc bib');
    console.log(docToDelete.fileStorageFullPath)
    var storageRef = this.storage.ref(docToDelete.fileStorageFullPath);
    storageRef.delete().subscribe(data => {
      // Suppression document bibliothèque
      let userDeleteRef = this.afs.doc(`users_bibliotheque/${docToDelete.uid}`);
      userDeleteRef.delete().catch(error => console.log(error));
    });
  }

  downloadFile(url){
    window.location.href = url;
    //window.location.assign(url);
  }
  ///// Upload

  upload(event) {
    let file = event.target.files[0];
    console.log(file);

    let checkFileErrors = this.checkFileBeforeUpload(file);
    if(checkFileErrors.length){
      this.preUploadError = checkFileErrors;
    }
    else {
      this.preUploadError = null;
      this.runUpload(file)
    }
  }

  // Vérification données du fichier avant de lancer l'upload
  checkFileBeforeUpload(file){
    let errors_message = [];
    if(file.size > this.upload_max_file_size){
      let max_file_size_mb = this.upload_max_file_size / 1024 / 1024;
      errors_message.push("La taille du fichier ne doit pas excéder " +  max_file_size_mb + "MB.");
    }
    if(!this.upload_mime_type_allowed.includes(file.type)){
      errors_message.push("Les fichiers " + file.type + " ne sont pas autorisés.");
    }
    return errors_message;
  }

  runUpload(file){
    let metadata = { customMetadata: { original_filename: file.name } };
    if(file.type.split("/")[0] == "image"){
      console.log('c une image');
      let metadata = { customMetadata: { orientation: 'landscape', original_filename: file.name } }
    }
    
    const randomId = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(this.upload_path + randomId);
    this.task = this.ref.put(file,metadata);
    this.uploadProgress = this.task.percentageChanges();
    this.uploadURL = this.task.downloadURL();
    this.task.then( report => {
      console.log(report)
      this.taskMetadata = report.metadata;
      this.isImage = this.taskMetadata.contentType.split("/")[0] == "image" ? true : false;
    }).catch( error => {
      console.log('upload error', error)
      this.uploadError = error;
    });
  }

  deleteUploadedFile(){
    const storageRef = this.afStorage.ref(this.taskMetadata.fullPath);
    storageRef.delete().subscribe(data => {
      console.log(data)
      this.deletedUpload = true;
      this.addOtherFile = true;
    });
  }

  reload() {
    //this.router.navigate(['upload2']);
    window.location.reload();
  }

}
