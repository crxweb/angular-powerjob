import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "./../../core/auth.service";
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalDefaultComponent } from "./../../shared/modal-default/modal-default.component";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl // Async validator
} from '@angular/forms';
import { CustomValidators } from "./../../form/validator/custom-validator.directive";
import { UsersService } from "./../../service/firestore/users.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  canEdit;
  canRead;

  // Formulaire email/mot de passe
  validateForm: FormGroup;
  checkConnection$: Observable<any>;

  constructor(
    public auth: AuthService, 
    private form: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.validateForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        CustomValidators.validEmailAdresse
      ]),
      password: new FormControl("", [
        Validators.required,
        CustomValidators.password
      ])
    });
  }

  signInWithEmailAndPassword() {
    // Connection
    this.auth.emailPasswordLogin(this.validateForm.value.email,this.validateForm.value.password).then( data => {
      if(this.auth.authState){
        //console.log(this.auth.authState)
        this.router.navigate ( [ '/home' ] );
      }
      else {
        this.openModalEchecConnection();
      }
    });
  }

  public resetPassword(): void {
    let valid_mail = this.validateForm.controls.email.errors === null ? true : false;
    console.log(valid_mail);
    if(this.validateForm.value.email.length){
      console.log('test email en bdd')
      let check = this.userService.isExistingUserMail(this.validateForm.value.email);
      console.log(check);
    }
  }


    // Modale confirmation suppression utilisateur
    public openModalEchecConnection(): void {
      const modal = this.modalService.show(ModalDefaultComponent)
      let modal_title = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Echec authentification'
      let modal_body = {
        body_message: "Les informations saisies ne vous permettent pas d'accéder à l'espace authentifié. Veuillez vérifier votre saisie ou cliquer sur le lien \"Mot de passe perdu\".",
        body_btn_close_txt: 'Fermer'
      }
      modal.content.showDefaultModal(modal_title, modal_body);
      // Exemple fermeture modale après 5secondes, modification message....
      /*
      setTimeout(() => {
        modal_body.body_message = "Tiens voila du boudin!"
        //modal.content.hideDefaultModal()
      }, 5000);*/
  }
  
}
