import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { environment } from './../../../environments/environment';

export class CustomValidators {
    
    static validEmailAdresse(c: FormControl): ValidationErrors {
        const email = c.value;
        var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        var isValid = true;
        const message = {
            'validEmailAdresse': {
                'message': 'Adresse mail non valide.'
            }
        };
        if (reg.test(email)){
            isValid = true;
        }
        else{
            isValid = false;
        }
        return isValid ? null : message;
    } 
    static password(c: FormControl): ValidationErrors { 
        const password = c.value;
        const isValid = password.length >= 8 && password.length <=15;
        const message = {
          'password': {
            'message': 'Mot de passe non valide (Min: 8 | Max: 15 caractères'
          }
        };
        return isValid ? null : message;
    }
    static typedocument(c: FormControl): ValidationErrors { 
        const type = c.value;
        const isValid = type.length && environment.app_config.bibliotheque.types_document.indexOf(type) > -1;
        const message = {
          'typedocument': {
            'message': "Ce type de document n'est pas valide"
          }
        };
        return isValid ? null : message;
    }
    static age(c: FormControl): ValidationErrors { 
       const num = Number(c.value);
       const isValid = !isNaN(num) && num >= 18 && num <= 85;
       const message = {
         'age': {
           'message': 'The age must be a valid number between 18 and 85'
         }
       };
       return isValid ? null : message;
    }
}
