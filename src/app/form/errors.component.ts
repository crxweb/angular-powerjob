import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'errors',
  template: `
  <br>
  <div class="alert alert-danger" role="alert" *ngIf="showErrors()">
    <ul *ngIf="showErrors()">
      <li style="color: red" *ngFor="let error of errors()">{{error}}</li>
    </ul>
  </div>
  `,
})
export class ErrorsComponent {

  private static readonly errorMessages = {
    'required': () => 'Champs obligatoire',
    'minlength': (params) => "Le nombre minimum de caractères autorisé est" + params.requiredLength,
    'maxlength': (params) => "Le nombre maximum de caractères autorisé est" + params.requiredLength,
    'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
    'age': (params) => params.message,
    'password': (params) => params.message,
    'validEmailAdresse': (params) => params.message,
    'validEmailAdresse2': (params) => params.message,
    'typedocument': (params) => params.message
  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;

  showErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
  }

  errors(): string[] {
    return Object.keys(this.control.errors)
      .map(field => this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    return ErrorsComponent.errorMessages[type](params);
  }

}
