import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AuthService } from "./../../core/auth.service";
import { UsersService } from "./../../service/firestore/users.service";
import { BibliothequeService } from "./../../service/firestore/bibliotheque.service";
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalConfirmComponent } from "./../../shared/modal-confirm/modal-confirm.component";
import { Observable } from "rxjs/Observable";
import { UserBibliotheque } from "./../../interface/UserBibliotheque";
import { FilesPipe } from "./../../pipe/files.pipe";
import { DatePipe } from '@angular/common';
import { TemplatePipePipe } from "./../../pipe/template-pipe.pipe";


@Component({
  selector: 'app-bibliotheque',
  templateUrl: './bibliotheque.component.html',
  styleUrls: ['./bibliotheque.component.css']
})
export class BibliothequeComponent implements OnInit {
  thumb_list_size = environment.app_config.bibliotheque.image_thumb_size_list;
  user;
  data$: Observable<UserBibliotheque[]>;
  userDocuments$: Observable<UserBibliotheque[]>;
  timeout: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;


  constructor(
    public auth: AuthService,
    private UserService: UsersService,
    private BibliothequeService: BibliothequeService,
    private router: Router,
    private modalService: BsModalService,
    private filesPipe: FilesPipe,
    private datePipe: DatePipe,
    private templatePipe: TemplatePipePipe
  ) { }

  ngOnInit() {

    // Récupération utilisateur connecté
    this.auth.user$.subscribe(userConnected => {
      this.UserService.getUserByUid(userConnected.uid).subscribe(user => {
        this.user = user;
        // Récupération des documents
        this.data$ = this.BibliothequeService.getUserConnectedDocuments();
        console.log(this.data$);
        console.log(typeof(this.data$));
        this.userDocuments$ = this.data$;
        console.log(this.userDocuments$);
        console.log(typeof(this.userDocuments$));
      });
    });

  }

  showConfirmDeleteModal(doc: UserBibliotheque): void {
    console.log(doc);
    const modal = this.modalService.show(ModalConfirmComponent)
    let body_message = '<p>Etes-vous certain de vouloir supprimer le document ci-dessous:</p>';
    body_message += '<ul>';
    body_message += '<li>Libellé: <strong>'+doc.documentLibelle+'</strong></li>';
    body_message += '<li>Type: <strong>'+doc.documentType+'</strong></li>';
    body_message += '<li>Taille: <strong>'+this.filesPipe.transform(doc.storage.size, 'fileSize')+'</strong></li>';
    body_message += '<li>Ajouté le: <strong>'+this.datePipe.transform(doc.documentAdded, 'dd/MM/yyyy HH:mm');+'</strong></li>';
    //body_message += '<li>Visuel: '+this.filesPipe.transform(doc.storage, 'filePreview',{size:this.thumb_list_size})+'</li>';
    body_message += '</ul>';

    let image = this.filesPipe.transform(doc.storage, 'filePreview',{size:this.thumb_list_size, renderNoImage: false});
    let modal_title = '<i class="fa fa-trash" aria-hidden="true"></i> Supprimer un document'
    let modal_body = {
      body_message: body_message,
      body_btn_confirm_txt: 'Confirmer la suppression',
      body_btn_cancel_txt: 'Annuler'
    }
    modal.content.showConfirmationModal(modal_title, modal_body, image);
    modal.content.onClose.subscribe(result => {
        if (result === true) {
            // when pressed Yes
            console.log('suppression du document confirmée')
            
        } else if(result === false) {
            // when pressed No
            console.log('refusée');
        } else {
            // When closing the modal without no or yes
            console.log('close whithout choice');
        }
    });
  }


  //////////////////////////////////
  ///// Utils
  //////////////////////////////////

  downloadFile(url){
    window.location.href = url;
    //window.location.assign(url);
  }

  reload() {
    //this.router.navigate(['upload2']);
    window.location.reload();
  }

  // Filte résulats
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    console.log(val);
    this.userDocuments$ = this.data$
        .map(x => {
            console.log(x);
            return x.filter(y=> 
              y.documentType.toLowerCase().indexOf(val.toLowerCase())>-1 
              || y.documentLibelle.toLowerCase().indexOf(val.toLowerCase())>-1 
              || y.fileStorageContentType.toLowerCase().indexOf(val.toLowerCase())>-1 
              || y.fileStorageOriginalName.toLowerCase().indexOf(val.toLowerCase())>-1
          );
    })
    this.table.offset = 0;
  }

}
