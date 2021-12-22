import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthService } from "./../../core/auth.service";
import { ModalContentComponent } from "./../../shared/modal/modal.component";
import {
  NgForm,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { CustomValidators } from './../../form/validator/custom-validator.directive';
import * as firebase from "firebase/app";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "angularfire2/firestore";


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  bsModalRef: BsModalRef;
  validateForm: FormGroup;
  emailIsChecked;
  passwordsIsChecked;

  constructor(
    private form: FormBuilder,
    public auth: AuthService, 
    private modalService: BsModalService,
    private router: Router,
    private afs: AngularFirestore

  ) { }

  ngOnInit() {
    this.validateForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'email': new FormControl('',[Validators.required,CustomValidators.validEmailAdresse]),
      'password': new FormControl('',[Validators.required,CustomValidators.password]),
      'passwordConfirm': new FormControl('',[Validators.required]),
    });

  }

  signUpWithEmailAndPassword() {
    this.auth.emailSignUp(this.validateForm.value.email,this.validateForm.value.password,this.validateForm.value.name).then( data => {
      if(this.auth.authState){
        this.router.navigate ( [ '/home' ] );
      }
      else {
        this.openModalEchecCreation();
      }
    });
  }

  openModalEchecCreation() {
    const list = [
      "Les informations saisies ne vous permettent pas d'accéder à l'espace authentifié. Veuillez vérifier votre saisie ou cliquer sur le lien \"Mot de passe perdu\""
    ];
    this.bsModalRef = this.modalService.show(ModalContentComponent);
    this.bsModalRef.content.title = "Echec de la creation de compte!";
    this.bsModalRef.content.list = list;
    /*
    setTimeout(() => {
      list.push('PROFIT!!!');
    }, 2000);*/
  }

  emailcheck(){
    if(this.validateForm.value.email){
      let collref = this.afs.collection('users').ref;
      let queryref = collref.where('email', '==', this.validateForm.value.email);
      queryref.get().then((snapShot) => {
        if (snapShot.empty) {
          this.emailIsChecked = true;
        }
        else {
          this.emailIsChecked = false;
        }
      })
    }
  }

  passwordsCheck(){
    this.passwordsIsChecked = this.validateForm.value.password == this.validateForm.value.passwordConfirm ? true : false;
  }

}
