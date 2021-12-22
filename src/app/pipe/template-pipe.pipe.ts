import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'templatePipe'
})
export class TemplatePipePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: any, methode: string, arg1: any = null): any {
    let pipe_content;

    switch (methode) {
      case 'sanitize':
        pipe_content = this.sanitized.bypassSecurityTrustHtml(value);
      break;
      // Liste des roles de l'utilisateur (rouge: non | vert: oui)
      case 'userRolesListe':
        let roles = value
        let roles_liste = "";
        for (var role in roles) {
          if (roles.hasOwnProperty(role)) {
            roles_liste += roles[role] ? "<li><span class=\"badge badge-success\">"+role+"</span></li>" : "<li><span class=\"badge badge-danger\">"+role+"</span></li>";
          }
        }
        pipe_content = this.sanitized.bypassSecurityTrustHtml(roles_liste);
        
      break;     
      case 'userRoleBadge':
        let onerole = value;
        if(arg1){
          let role_badge = onerole ? "  <span class=\"badge badge-success\">"+arg1+"</span>" : "  <span class=\"badge badge-danger\">"+arg1+"</span>";
          pipe_content = this.sanitized.bypassSecurityTrustHtml(role_badge);
        }
        else {
          let role_badge = onerole ? "<span class=\"badge badge-success\">OUI</span>" : "<span class=\"badge badge-danger\">NON</span>";
          pipe_content = this.sanitized.bypassSecurityTrustHtml(role_badge);
        }
      break;
      case 'jsonPropertyValue':
      let keys = [];
      for (let key in value) {
        keys.push({key: key, value: value[key]});
      }
      pipe_content = keys;
      break;

      case 'uid':
        let uid = value;
        uid = "<span class=\"badge badge-secondary uid\">"+uid+"</span>";
        console.log(uid);
        pipe_content = this.sanitized.bypassSecurityTrustHtml(uid);
      break;
      default:
      break;
    }
   
    return pipe_content;

  }


}
