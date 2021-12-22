import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "./../../core/auth.service";
import { UsersService } from "./../../service/firestore/users.service";
import { EmploiService } from "./../../service/firestore/emploi.service";
import { OffresEmploiService } from "./../../service/emploi-store/offres-emploi.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EmploiSearchFormComponent } from '../emploi-search-form/emploi-search-form.component';
import 'rxjs/add/observable/interval';
import { Observable } from "rxjs/Observable";
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { EmploiCritereRecherche } from "./../../interface/EmploiCritereRecherche";

@Component({
  selector: 'app-emploi-search-results',
  templateUrl: './emploi-search-results.component.html',
  styleUrls: ['./emploi-search-results.component.css']
})
export class EmploiSearchResultsComponent implements OnInit {

  user;
  myTokenObject: any;
  idCritere: string;
  searchType: string;
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
      "contractNatureCode": null,
      "largeAreaCode": null,
      "delaySinceCreation": null,
      "keywords": null
    }
  };

  oe_current_liste: any;
  oe_total_count: 0;

  ///////
  oe_box = []; // Liste finale des résultats de la recherche

  // Datatable
  rows = [];
  rowsData = [];
  timeout: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Nb résultats par page
  pages;
  selectedNbPerPage;
  nbDataPerPage = 10;

  subIntervalSec = 5000;
  sub;
  subCounter = 0;

  constructor(
    public auth: AuthService,
    private UserService: UsersService,
    private afsEmploiService: EmploiService,
    private estOffresEmploiService: OffresEmploiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Récupération utilisateur connecté
    this.auth.user$.subscribe(userConnected => {
      this.UserService.getUserByUid(userConnected.uid).subscribe(user => {
        this.user = user;
        //console.log(this.user);

        this.route.params.forEach((params: Params) => {
          this.idCritere = params['idCritere'];
          this.searchType = params['searchType'];
          console.log(this.searchType);

          // Récupération Firestore critères recherche / idCritere
          this.afsEmploiService.getCritereById(this.idCritere).subscribe(critere => {
            console.log(critere);
            this.critere = critere.criterias;
            console.log(this.critere);
            this.populateSearchCriterias();
            console.log(this.searchParam);

            // Exécute la requête
            this.estOffresEmploiService.getToken().subscribe(
              promiseToken => (
                this.myTokenObject = JSON.parse(promiseToken["_body"]),
                this.searchOffresEmploi(this.myTokenObject.access_token)
              ),
              error => console.log("Error :: " + error)
            );

          })
        });

      });
    });

    this.pages = [
      {label: '10 par page', value: 10},
      {label: '20 par page', value: 20},
      {label: '50 par page', value: 50},
      {label: '100 par page', value: 100}
  ];

  }


  // 1ère requête permettant de récupérer le nombre total de resultats
  searchOffresEmploi(token) {
    this.estOffresEmploiService.searchOffresEmploi(token, this.searchParam).subscribe(
      promiseListe => (
        this.oe_current_liste = JSON.parse(promiseListe["_body"]).results,
        console.log(this.oe_current_liste),
        this.oe_total_count = JSON.parse(promiseListe["_body"]).technicalParameters.totalNumber,
        console.log(JSON.parse(promiseListe["_body"]).technicalParameters.totalNumber),
        this.configLoopCall()
      ),
      error => (
        // Exemple d'erreur: {"classeOrigine":"fr.pe.empl.exposition.ex035.exception.ErreurFonctionnelle","codeErreur":"1512901058081","codeHttp":400,"message":"La donnée salaryCurrencyCode est obligatoire si la donnée minSalary est renseignée."}
        console.log("Error :: " + error)
      )
    );
  }


  configLoopCall() {
    if (this.searchType == "avancee") {
      const total_count = this.oe_total_count < 1000 ? this.oe_total_count : 1000;
      console.log('total_count', total_count);
      const nb_request = Math.ceil(total_count / this.searchParam.technicalParameters.per_page);
      console.log('nb_request', nb_request);
      this.loopCallService(nb_request)
    }
    else {
      this.getOffreEmploi(this.searchParam);
    }

  }



  loopCallService(nb_request) {
    this.sub = Observable.interval(this.subIntervalSec).subscribe((val) => {
      this.subCounter++;
      console.log('request number: ' + this.subCounter);
      if (this.subCounter <= nb_request) {
        this.dosomething();
      }
      else {
        console.log('ne plus suivre!');
        this.sub.unsubscribe();
        console.log('liste de toutes les offres');
        console.log(this.oe_box);
        console.log(this.oe_box.length, this.oe_total_count);
      }
    });
  }

  getOffreEmploi(searchParam) {
    this.estOffresEmploiService.searchOffresEmploi(this.myTokenObject.access_token, searchParam).subscribe(
      promiseListe => (
        this.oe_current_liste = JSON.parse(promiseListe["_body"]).results,
        this.oe_current_liste.forEach(oe => {
          this.oe_box.push(oe);
        }),
        this.fetch((data) => {
          this.rows = data;
          this.rowsData = data;
        })

      ),
      error => (
        // Exemple d'erreur: {"classeOrigine":"fr.pe.empl.exposition.ex035.exception.ErreurFonctionnelle","codeErreur":"1512901058081","codeHttp":400,"message":"La donnée salaryCurrencyCode est obligatoire si la donnée minSalary est renseignée."}
        console.log("Error :: " + error)
      )
    );
  }



  dosomething() {
    let page = this.subCounter;
    /*
    let searchParam: any = {
      "technicalParameters": {
        "page": page,
        "per_page": 100,
        "sort": 1
      },
      "criterias": {
        "keywords": "web"
      }
    };
    console.log(searchParam);
    this.getOffreEmploi(searchParam);*/
    this.searchParam.technicalParameters.page = page;
    console.log(this.searchParam);
    this.getOffreEmploi(this.searchParam);
    console.log('do something function at THE ' + page);
  }

  // Complète les critères de recherche en fonction retour firestore
  populateSearchCriterias(){

    if(this.critere.hasOwnProperty('romeProfessionCardCode')){
      if(this.critere.romeProfessionCardCode){
        this.searchParam.criterias.romeProfessionCardCode = this.critere.romeProfessionCardCode;
      }
    }
    if(this.critere.hasOwnProperty('contractTypeCode')){
      if(this.critere.contractTypeCode.length){
        this.searchParam.criterias.contractTypeCode = this.critere.contractTypeCode;
      }
    }
    if(this.critere.hasOwnProperty('contractNatureCode')){
      if(this.critere.contractNatureCode.length){
        this.searchParam.criterias.contractNatureCode = this.critere.contractNatureCode;
      }
    }
    if(this.critere.hasOwnProperty('largeAreaCode')){
      if(this.critere.largeAreaCode.length){
        this.searchParam.criterias.largeAreaCode = this.critere.largeAreaCode;
      }
    }
    if(this.critere.hasOwnProperty('delaySinceCreation')){
      if(this.critere.delaySinceCreation){
        this.searchParam.criterias.delaySinceCreation = this.critere.delaySinceCreation;
      }
    }
    if(this.critere.hasOwnProperty('keywords')){
      if(this.critere.keywords.length){
        this.searchParam.criterias.keywords = this.critere.keywords;
      }
    }
    if(this.critere.hasOwnProperty('cityCode')){
      if(this.critere.cityCode){
        this.searchParam.criterias.cityCode = this.critere.cityCode;
      }
    }
    if(this.critere.hasOwnProperty('cityDistance')){
      this.searchParam.criterias.cityDistance = this.critere.cityDistance;
    } 
    if(this.critere.hasOwnProperty('departmentCode')){
      if(this.critere.departmentCode){
        this.searchParam.criterias.departmentCode = this.critere.departmentCode;
      }
    }
    if(this.critere.hasOwnProperty('includeDepartementBoundaries')){
      if(this.critere.includeDepartementBoundaries){
        this.searchParam.criterias.includeDepartementBoundaries = this.critere.includeDepartementBoundaries;
      }
    } 
    if(this.critere.hasOwnProperty('regionCode')){
      if(this.critere.regionCode){
        this.searchParam.criterias.regionCode = this.critere.regionCode;
      }
    } 
    if(this.critere.hasOwnProperty('countryCode')){
      if(this.critere.countryCode){
        this.searchParam.criterias.countryCode = this.critere.countryCode;
      }
    }         
  }


  // Datatable methods
  fetch(cb) {
    cb(this.oe_box);
  }

  // Filte résulats
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    if(val.length){
      var myData = [];
      this.rowsData.forEach(function(offre) {
        if(
          offre.title.toLowerCase().indexOf(val.toLowerCase())>-1
          || ( offre.hasOwnProperty('cityCode') && offre.cityCode.toLowerCase().indexOf(val.toLowerCase())>-1 ) 
          || ( offre.hasOwnProperty('cityName') && offre.cityName.toLowerCase().indexOf(val.toLowerCase())>-1 ) 
          || ( offre.hasOwnProperty('contractTypeCode') && offre.contractTypeCode.toLowerCase().indexOf(val.toLowerCase())>-1)
          || ( offre.hasOwnProperty('companyName') && offre.companyName.toLowerCase().indexOf(val.toLowerCase())>-1 )
        )
        {
          myData.push(offre);
        }
      });
      this.rows = myData;
    }
    else {
      this.rows = this.rowsData;
    }

  }

  reCalculateNbResultPerPage(){
    this.nbDataPerPage = this.selectedNbPerPage.value;
    this.table.recalculate();
  }


}
