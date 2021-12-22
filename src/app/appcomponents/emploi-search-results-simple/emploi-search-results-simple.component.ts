import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AuthService } from "./../../core/auth.service";
import { UsersService } from "./../../service/firestore/users.service";
import { BibliothequeService } from "./../../service/firestore/bibliotheque.service";
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalConfirmComponent } from "./../../shared/modal-confirm/modal-confirm.component";
import { Observable } from "rxjs/Observable";
import { UserBibliotheque } from "./../../interface/UserBibliotheque";
import { FilesPipe } from "./../../pipe/files.pipe";
import { DatePipe } from '@angular/common';
import { TemplatePipePipe } from "./../../pipe/template-pipe.pipe";
import { OffresEmploiService } from "./../../service/emploi-store/offres-emploi.service";


@Component({
  selector: 'app-emploi-search-results-simple',
  templateUrl: './emploi-search-results-simple.component.html',
  styleUrls: ['./emploi-search-results-simple.component.css']
})
export class EmploiSearchResultsSimpleComponent implements OnInit {

  user;
  dataOffre_liste$: Observable<any[]>;
  offres_liste$: Observable<any[]>;


  myTokenObject: any;
  idCritere: string;
  critere;
  searchParam: any = {
    "technicalParameters": {
      "page": 1,
      "per_page": 100,
      "sort": 1
    },
    "criterias": {
      "romeProfessionCardCode": null,
      "contractTypeCode": null,
      "delaySinceCreation": 7
    }
  };

  constructor(
    public auth: AuthService,
    private UserService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private OffresEmploiService: OffresEmploiService
  ) { }

  ngOnInit() {
    // Récupération utilisateur connecté
    this.auth.user$.subscribe(userConnected => {
      this.UserService.getUserByUid(userConnected.uid).subscribe(user => {
        this.user = user;
        this.route.params.forEach((params: Params) => {
          this.idCritere = params['idCritere'];
          console.log(this.idCritere);
          
        })
      });

    });
  }

}
