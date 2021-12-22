import { Component, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from "./../../core/auth.service";
import { UsersService } from "./../../service/firestore/users.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { EmploiService } from "./../../service/firestore/emploi.service";
import { OffresEmploiService } from "./../../service/emploi-store/offres-emploi.service";
import { OpendatasoftService } from "./../../service/opendatasoft.service";
import { GeoapigouvfrService } from "./../../service/geoapigouvfr.service";
import { EmploiCritereRecherche } from "./../../interface/EmploiCritereRecherche";
import { EmploiRefAppellation } from "./../../interface/EmploiRefAppellation";
import { Observable } from "rxjs/Observable";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import {
  NgForm,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { CustomValidators } from './../../form/validator/custom-validator.directive';



@Component({
  selector: 'app-emploi-search-form',
  templateUrl: './emploi-search-form.component.html',
  styleUrls: ['./emploi-search-form.component.css']
})
export class EmploiSearchFormComponent implements OnInit {
  user;
  myTokenObject: any;
  // ID Référentiels utilisés
  ref_contrat_type = "0e8e3591-0a8e-471f-ae80-86bbb3f1b23d";
  ref_contrat_spe = "167d1031-ce27-4c35-9d01-d0ee96d85ead";
  ref_experience = "386075a7-ad0b-42e2-8e59-8aeddb4b872a";
  ref_domaine_pro = "e5eba2a1-d8f4-4762-abc2-cb8bb00686d4";
  ref_type_salaire = "b8171079-c6eb-4928-9993-8363b960f894";
  ref_type_horaire = "1a6b6cdd-9e72-4168-b565-80b30821954a";



  ///// Formulaire de recherche
  metierSelectionnes = [];
  delaySince = null;

  formTypes = [];
  selectedFormType: string = "searchFormSimple";
  localisationTypes = ["ville","departement","region","pays"];
  selectedLocalisationType: string = "ville";

  delaySinceListe = [
    { value: 1, libelle: "1 Jour" },
    { value: 3, libelle: "3 Jours" },
    { value: 7, libelle: "1 Semaine" },
    { value: 14, libelle: "2 Semaines" },
    { value: 30, libelle: "1 Mois" },
    { value: null, libelle: "Toutes les offres" }
  ]

  ref_appellations: EmploiRefAppellation[];
  formAppellation: EmploiRefAppellation;

  // Liste associées à référentiels
  liste_contrat_type = [];
  liste_contrat_spec = [];
  show_more_contratSpec = false;
  liste_experience = [];
  liste_domaine_pro = [];
  liste_type_salaire = [];
  liste_type_horaire = [];


  validateForm: FormGroup;
  villes = [];
  departements = [];
  regions = [];
  pays = [];
  



  @ViewChildren('cbxContratSpec') checkboxesContratSpec;
  @ViewChildren('cbxContratType') checkboxesContratType;
  @ViewChildren('cbxDomainePro') checkboxesDomainePro;





  ///// Paramètres de recherche / Firestore
  userSearchParamListe = [];
  emploiCollection: AngularFirestoreCollection<EmploiCritereRecherche>;

  // Exemple objet renvoyé à emploi-search-result permettant d'executer la requête et conserver les paramètres de la recherche
  searchParam: any = {
    "technicalParameters": {
      "page": 1,
      "per_page": 50,
      "sort": 1
    },
    "criterias": {
      "romeProfessionCardCode": ["M1805", "H1208"],
      "contractTypeCode": ["CDD", "CDI"],
      "delaySinceCreation": 1,
      //"contractTypeCode": 
      //"qualificationCode": "0", // non cadre
      //"keywords": "banque",
    }
  };





  constructor(
    public auth: AuthService,
    private UserService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private afsEmploiService: EmploiService,
    private estOffresEmploiService: OffresEmploiService,
    private openDataSoftService: OpendatasoftService,
    private geoapigouvfrService: GeoapigouvfrService,
    public afs: AngularFirestore,
    private form: FormBuilder
  ) { }

  ngOnInit() {

    this.villes = [];
    this.getDepartements();
    this.getRegions();
    this.getPays();


    // Récupération utilisateur connecté
    this.ref_appellations = this.estOffresEmploiService.getRefAppellation();
    //console.log(this.ref_appellations);

    // Récupération des référentiels
    this.estOffresEmploiService
      .getToken()
      .subscribe(
      promiseToken => (
        (this.myTokenObject = JSON.parse(promiseToken["_body"])),
        this.getReferentielListe(this.myTokenObject.access_token, this.ref_contrat_type, "liste_contrat_type"),
        this.getReferentielListe(this.myTokenObject.access_token, this.ref_contrat_spe, "liste_contrat_spec"),
        this.getReferentielListe(this.myTokenObject.access_token, this.ref_experience, "liste_experience"),
        this.getReferentielListe(this.myTokenObject.access_token, this.ref_domaine_pro, "liste_domaine_pro"),
        this.getReferentielListe(this.myTokenObject.access_token, this.ref_type_salaire, "liste_type_salaire"),
        this.getReferentielListe(this.myTokenObject.access_token, this.ref_type_horaire, "liste_type_horaire")
      ),
      error => console.log("Error :: " + error)
      );

    // Type formulaire (affichage/masque critères de recherche)
    this.formTypes = [
        {label: 'Recherche simple', value: 'searchFormSimple', icon: 'fa fa-fw fa-search'},
        {label: 'Recherche avancée', value: 'searchFormAdvanced', icon: 'fa fa-fw fa-search-plus'}
    ];

    this.validateForm = new FormGroup({
      'keywords': new FormControl([]),
      'metier': new FormControl(''/*, Validators.required*/),
      'contrat': new FormControl([]),
      'contratSpec': new FormControl([]),
      'domainePro': new FormControl([]),
      'romecode': new FormControl([]),
      'metierliste': new FormControl([]),
      'delaySince': new FormControl(null),
      'codepostal': new FormControl(null),
      'cityCode': new FormControl(''),
      'cityDistance': new FormControl(15),
      'departmentCode': new FormControl(''),
      'includeDepartementBoundaries': new FormControl(null),
      'regionCode': new FormControl(''),
      'countryCode': new FormControl('')
    });

    this.auth.user$.subscribe(userConnected => {
      this.UserService.getUserByUid(userConnected.uid).subscribe(user => {
        this.user = user;
        //console.log(this.user);

        //this.data$ = this.afsEmploiService.getCritereListe();
        //console.log(this.data$);

        this.afsEmploiService.getCritereListe().subscribe(data => {
          //console.log(data)
          this.userSearchParamListe = data;
        })

        // Lancer quand clique sur bouton recherche et que l'on a bien le retour ajout search param firestore
        //this.loadResults();
      });
    });
  }

  loadResults(idCritere) {
    console.log('redirection?');
    //this.router.navigate(['emploiSearchResults', this.critereRechercheId, 'simple']);
    //this.router.navigate(['emploiSearchResults', this.critereRechercheId, 'avancee']);
    this.router.navigate(['emploiSearchResults', idCritere, 'avancee']);
  }

  submitSearchForm() {
    console.log('submit search form...');
    this.saveSearchParam();
  }

  // Méthode permettant de récupérer les différents référentiels
  getReferentielListe(token, referentielId, assignment) {
    this.estOffresEmploiService
      .getReferentielContenu(token, referentielId)
      .subscribe(
      promiseListe => (
        (
          this[assignment] = JSON.parse(promiseListe["_body"]).result.records),
        localStorage.setItem(assignment, JSON.stringify(this[assignment]))
      ),
      error => console.log("Error :: " + error)
      );
  }

  saveSearchParam() {
    //console.log(this.validateForm.value);
    //console.log('localisation type',this.selectedLocalisationType);
    let now: Date = new Date();
    const newSearchParam: EmploiCritereRecherche = {
      dateAdded: now,
      criterias: {
        contractTypeCode: this.validateForm.value.contrat,
        romeProfessionCardCode: this.validateForm.value.romecode,
        contractNatureCode: this.validateForm.value.contratSpec,
        largeAreaCode: this.validateForm.value.domainePro,
        delaySinceCreation: this.validateForm.value.delaySince,
        keywords: this.validateForm.value.keywords
      }
    }
    if(this.selectedLocalisationType=="ville"){
      newSearchParam.criterias.cityCode = this.validateForm.value.cityCode.hasOwnProperty('inseecode') ? this.validateForm.value.cityCode.inseecode : null;
      newSearchParam.criterias.cityDistance = this.validateForm.value.cityDistance ? this.validateForm.value.cityDistance : null;
      if(newSearchParam.criterias.cityCode === null){
        newSearchParam.criterias.cityDistance = null;
      }
    }
    if(this.selectedLocalisationType=="departement"){
      /*
      let depts = this.validateForm.value.departmentCode;
      if(depts.length){
        newSearchParam.criterias.departmentCode = [];
        depts.forEach(dpt => {
          newSearchParam.criterias.departmentCode.push(dpt.code);
        })
        newSearchParam.criterias.includeDepartementBoundaries = this.validateForm.value.includeDepartementBoundaries ? 1 : 0;
      }*/

      //newSearchParam.criterias.departmentCode = this.validateForm.value.departmentCode ? this.validateForm.value.departmentCode.code : null;
      //newSearchParam.criterias.includeDepartementBoundaries = this.validateForm.value.includeDepartementBoundaries ? 1 : 0;
    }
    if(this.selectedLocalisationType=="region"){
      newSearchParam.criterias.regionCode = this.validateForm.value.regionCode ? this.validateForm.value.regionCode.code : null;
    }
    if(this.selectedLocalisationType=="pays"){
      newSearchParam.criterias.countryCode = this.validateForm.value.countryCode ? this.validateForm.value.countryCode.code : null;
    }

    console.log(newSearchParam);
    
    this.emploiCollection = this.afs.collection("emploi/" + this.user.uid + "/criteres-recherche");
    this.emploiCollection.add(newSearchParam).then(data => {
      console.log(data.id),
        this.loadResults(data.id);

    }).catch(error => {
      console.log(error)
    })
    
    
  }

  // Formulaire - Appellation métier
  typeaheadOnSelect(e: TypeaheadMatch): void {
    this.formAppellation = e.item;
    this.metierSelectionnes.push({ "libelle": e.item.ROME_PROFESSION_SHORT_NAME + "(CODE ROME: " + e.item.ROME_PROFESSION_CARD_CODE + ")", "romecode": e.item.ROME_PROFESSION_CARD_CODE });
    this.validateForm.value.romecode.push(this.formAppellation.ROME_PROFESSION_CARD_CODE);
    this.validateForm.value.metierliste.push(this.formAppellation.ROME_PROFESSION_SHORT_NAME);
    this.validateForm.controls.metier.setValue("");
    console.log(this.validateForm.value.romecode);
  }

  // Supprimer appellation métier
  removeMetier(index) {
    console.log('index', index);
    console.log('suppression ', this.metierSelectionnes[index]);
    this.metierSelectionnes.splice(index, 1);
    this.validateForm.value.romecode.splice(index, 1);
    console.log(this.validateForm.value.romecode);
  }


  // Sélection type de contrat
  onContratTypeSelectionChange(e, contratType: String): void {
    if (e.target.checked) this.validateForm.value.contrat.push(contratType);
    else {
      let index = this.validateForm.value.contrat.indexOf(contratType);

      if (index > -1) {
        this.validateForm.value.contrat.splice(index, 1);
      }
    }
  }

  // Limitation choix contrat type
  checkCountCheckboxContratType() {
    this.checkboxesContratType.toArray().map(x => {
      if (this.validateForm.value.contrat.length == 4) {
        if (!x.nativeElement.checked) {
          x.nativeElement.disabled = true;
        }
      }
      else {
        x.nativeElement.disabled = false;
      }
    })
  }

  // Sélection contrat spécifique
  onContratSpecSelectionChange(e, contratSpec: String): void {
    if (e.target.checked) {
      if (this.validateForm.value.contratSpec.length < 5) {
        this.validateForm.value.contratSpec.push(contratSpec);
      }
    }
    else {
      let index = this.validateForm.value.contratSpec.indexOf(contratSpec);

      if (index > -1) {
        this.validateForm.value.contratSpec.splice(index, 1);
      }
    }
  }

  // Limitation choix contrats spécifiques
  checkCountCheckboxContratSpec() {
    this.checkboxesContratSpec.toArray().map(x => {
      if (this.validateForm.value.contratSpec.length == 4) {
        if (!x.nativeElement.checked) {
          x.nativeElement.disabled = true;
        }
      }
      else {
        x.nativeElement.disabled = false;
      }

    })
  }

  // Sélection domaine professionnel
  onDomaineProSelectionChange(e, domainepro: String): void {
    if (e.target.checked) this.validateForm.value.domainePro.push(domainepro);
    else {
      let index = this.validateForm.value.domainePro.indexOf(domainepro);

      if (index > -1) {
        this.validateForm.value.domainePro.splice(index, 1);
      }
    }
  }

  // Limitation choix contrat type
  checkCountCheckboxDomainePro() {
    this.checkboxesDomainePro.toArray().map(x => {
      if (this.validateForm.value.domainePro.length == 4) {
        if (!x.nativeElement.checked) {
          x.nativeElement.disabled = true;
        }
      }
      else {
        x.nativeElement.disabled = false;
      }
    })
  }

  getDisabledStatusContratSpec(contratSpecCode) {
    if (this.validateForm.value.contratSpec.length <= 5) {
      return false;
    }
    return true;
  }


  // Sélection date création de l'offre
  selectDelaySince(event) {
    //let delay = +event.target.value ? +event.target.value : null; // @todo mettre en string
    let delay = +event.target.value ? event.target.value : null;
    this.validateForm.controls.delaySince.setValue(delay);
  }

  // Mots clés
  onKeywordAdd($event){
    let keyWord = $event.value;
    let validSyntaxe = /^[a-zA-Z0-9 @#$%^&+./-]+$/.test(keyWord);
    if(keyWord.length < 2 ||!validSyntaxe){
      this.validateForm.value.keywords.splice(-1,1);
    }
  }

  // Localisation
  onTabChange(event) {
    //console.log('index',event.index);
    this.selectedLocalisationType = this.localisationTypes[event.index];
    console.log(this.selectedLocalisationType);
  }

  getVillesByCp(code_postal) {
    this.openDataSoftService
      .getVillesByCp(code_postal)
      .subscribe(
        promiseListe => (
          this.populateVillesByCp(promiseListe["_body"])
        ),
        error => console.log("Error :: " + error)
      );
  }

  populateVillesByCp(data){
    this.villes = [];
    let res = JSON.parse(data);
    let nhits = res.nhits;
    if(nhits){
      let villes = res.records;
      villes.forEach(ville => {
        //console.log(ville.fields.insee_com,ville.fields.nom_comm);
        this.villes.push({name: ville.fields.nom_comm, inseecode: ville.fields.insee_com});
        //this.liste_ville_by_cp.push({insee_code: ville.fields.insee_com, ville_nom: ville.fields.nom_comm, obj: ville});
      });
      console.log(this.villes);
    }
    else {
      console.log('aucune ville trouvée pour ce code postal');
    }
  }

  getDepartements() {
    console.log('recup depts');
    this.geoapigouvfrService
      .getDepartementsListe()
      .subscribe(
        promiseListe => (
          this.populateDepartements(promiseListe["_body"])
        ),
        error => console.log("Error :: " + error)
      );
  }

  populateDepartements(data){
    let res = JSON.parse(data);
    if(res.length){
      let depts = res;
      depts.forEach(dept => {
        this.departements.push({nom: dept.nom, code: dept.code});
      });
      console.log(this.departements);
    }
  }
  
  getRegions() {
    console.log('recup depts');
    this.geoapigouvfrService
      .getRegionsListe()
      .subscribe(
        promiseListe => (
          this.populateRegions(promiseListe["_body"])
        ),
        error => console.log("Error :: " + error)
      );
  }

  populateRegions(data){
    let res = JSON.parse(data);
    if(res.length){
      let regs = res;
      regs.forEach(reg => {
        this.regions.push({nom: reg.nom, code: reg.code});
      });
      console.log(this.departements);
    }
  }

  getPays() {
    this.pays = this.estOffresEmploiService.getCountryAvailable();
    console.log(this.pays);
  }

  onCpSelectionChange(){
    let cp = this.validateForm.value.codepostal;
    cp = cp.replace(/_/g,'');
    let valid_cp = /^(([0-8][0-9])|(9[0-5])|(2[ab]))[0-9]{3}$/.test(cp);
    if(valid_cp){
      this.getVillesByCp(this.validateForm.value.codepostal);
    }
  }

  onVilleSelectionChange($event){
    console.log('ville: ', this.validateForm.value.cityCode);
  }

  onDepartementSelectionChange($event){
    console.log($event);
    //this.validateForm.value.cityCode = $event.value.inseecode;
    console.log('departement: ', this.validateForm.value.departmentCode);
  }

  onRegionSelectionChange($event){
    console.log($event);
    //this.validateForm.value.cityCode = $event.value.inseecode;
    console.log('region: ', this.validateForm.value.regionCode);
  }
}
