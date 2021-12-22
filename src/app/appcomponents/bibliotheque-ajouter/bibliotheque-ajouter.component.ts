import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthService } from "./../../core/auth.service";
import { ModalContentComponent } from "./../../shared/modal/modal.component";
import { environment } from './../../../environments/environment';
import {
  NgForm,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { CustomValidators } from './../../form/validator/custom-validator.directive';

/////
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
import "rxjs/add/operator/map";
/////


@Component({
  selector: 'app-bibliotheque-ajouter',
  templateUrl: './bibliotheque-ajouter.component.html',
  styleUrls: ['./bibliotheque-ajouter.component.css']
})
export class BibliothequeAjouterComponent implements OnInit {
  bsModalRef: BsModalRef;
  user;
  // Formulaire
  validateForm: FormGroup;
  libelleIsTaken: boolean = false;
  passwordsIsChecked;
  documentTypes = environment.app_config.bibliotheque.types_document;
  userDocumentsCollection: AngularFirestoreCollection<UserBibliotheque>;

  // Upload du fichier
  upload_path = environment.app_config.upload_config.path.bibliotheque;
  upload_max_file_size = environment.app_config.upload_config.max_file_size.bibliotheque;
  upload_mime_type_allowed = environment.app_config.upload_config.mime_type_allowed.bibliotheque;
  acceptmime: string =  "audio/*,video/*,image/*,application/*"; //"file_extension|audio/*|video/*|image/*|media_type";
  acceptmimeFrdly: string = "";
  ref;
  task;
  taskMetadata; // Meta data fichier téléchargé
  uploadProgress;
  uploadURL;
  isImage: boolean;
  deletedUpload: boolean; // suppression du fichier
  addOtherFile: boolean;
  preUploadError;
  uploadError: any;

  userBibliothequeCollection: AngularFirestoreCollection<UserBibliotheque>;

  constructor(
    private form: FormBuilder,
    public auth: AuthService,
    public UserService: UsersService,
    public afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private router: Router,
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(userConnected => {
      this.UserService.getUserByUid(userConnected.uid).subscribe(user => {
        this.user = user;
        this.userDocumentsCollection = this.afs.collection(environment.app_config.firestore.collection.bibliotheque, ref => {
          return ref.where('userId', '==', user.uid)
        });
      });
    });
    /*
    this.upload_mime_type_allowed.forEach((mime, index) => {
      let sep = index ? "<br>":"";
      this.acceptmimeFrdly += sep + mime;
    });
    console.log(this.acceptmimeFrdly);*/

    
    this.validateForm = new FormGroup({
      'libelle': new FormControl('', Validators.required),
      'type': new FormControl('',[Validators.required,CustomValidators.typedocument])
    });
    this.validateForm.controls.type.setValue("undefined");
  }

  checkLibelleTaken(){
    let libelle = this.validateForm.value.libelle.toLowerCase();
    let keepGoing = true;
    this.userDocumentsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as UserBibliotheque;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }).subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(keepGoing) {
            if(doc.documentLibelle.toLowerCase() == libelle){
              keepGoing = false;
            }
            console.log('on y arrive');
            this.libelleIsTaken = doc.documentLibelle.toLowerCase() == libelle ? true : false;
          }
        });
    });
  }


  // Upload
  upload(event) {
    //let file = event.target.files[0];
    let file = event.files[0];
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
      this.taskMetadata = report.metadata;
      this.isImage = this.taskMetadata.contentType.split("/")[0] == "image" ? true : false;
      if(this.taskMetadata.downloadURLs[0].length){
        this.addUploadToBibliotheque();
      }
    }).catch( error => {
      console.log('upload error', error)
      this.uploadError = error;
    });
  }

  addUploadToBibliotheque(){
    console.log(this.taskMetadata)
    let now: Date = new Date(); 
    const newDocument: UserBibliotheque = {
      documentAdded: now,
      //documentUpdated?: Date,
      documentType: this.validateForm.value.type,
      documentLibelle: this.validateForm.value.libelle,
      fileStorageContentType: this.taskMetadata.contentType,
      fileStorageFullPath: this.taskMetadata.fullPath,
      fileStorageName: this.taskMetadata.name,
      fileStorageOriginalName: this.taskMetadata.customMetadata.original_filename,
      fileStorageSize: this.taskMetadata.size,
      userId: this.user.uid
    }
    console.log(newDocument);
    this.addUserDocument(newDocument);
  }

  addUserDocument(userDoc: UserBibliotheque) {
    this.userBibliothequeCollection = this.afs.collection('users_bibliotheque');
    this.userBibliothequeCollection.add(userDoc).then(data => {
      console.log(data);
      this.router.navigate(['/bibliotheque']);
    }).catch(error => {
      console.log(error)
    })
  } 
}
