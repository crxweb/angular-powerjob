import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { EmploiRefAppellation } from "./../../interface/EmploiRefAppellation";
import { REF_APPELLATION } from "./../../service/emploi-store/REF_APPELLATION";
import "rxjs/Rx";
import "rxjs/add/operator/map";

@Injectable()
export class OffresEmploiService {

  private cors_prefix_url = "https://cors-anywhere.herokuapp.com/";
  private url_emploi_store = this.cors_prefix_url + "https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=partenaire";
  private client_id = "PAR_pilotejob_61330e33513de0432eaf2a84770e32342a91751252a73263953f8d13d16decb3";
  private client_secret = "ba148b799fb2e670987c02a030198f9feb0096edc391464c20a1f412bd21c856";
  private scope = "application_" + this.client_id + " api_infotravailv1 api_labonneboitev1 api_retouralemploisuiteformationv1 api_cataloguedesservicesemploistorev1 emploistoreusagers api_instarlinkv1 api_offresdemploiv1 o2dsoffre";

  myTokenObject: any;
  listeOffreEmploi: Observable<any[]>;

  // a degager
  searchParam: any = {
    "technicalParameters" : {
      "page": 1,
      "per_page": 100,
      "sort": 1
    },
    "criterias" : {
      "romeProfessionCardCode": null,
      "contractTypeCode": null,
      "delaySinceCreation": 7
    }
  };

  constructor(private http: Http) { }

  createAuthorizationHeader(headers: Headers, param = { token: null, contentType: null, accept: null }) {
    if (param.hasOwnProperty("contentType") && param.contentType !== null) {
      headers.append('Content-Type', param.contentType);
    }
    if (param.hasOwnProperty("accept") && param.accept !== null) {
      headers.append('Accept', param.accept);
    }
    if (param.hasOwnProperty("token") && param.token !== null) {
      headers.append('Authorization', 'Bearer ' + param.token);
    }
  }

  getToken(): Observable<any> {
    let body = 'grant_type=client_credentials&client_id=' + this.client_id + '&client_secret=' + this.client_secret + '&scope=' + this.scope;
    let headers = new Headers();
    this.createAuthorizationHeader(headers, { token: null, contentType: "application/x-www-form-urlencoded", accept: null });
    return this.http.post(this.url_emploi_store, body, {
      headers: headers
    });
  }

  // Recherche multicritère offres d'emplois
  searchOffresEmploi(token, request_data): Observable<any> {
    let request_url = this.cors_prefix_url + "https://api.emploi-store.fr/partenaire/offresdemploi/v1/rechercheroffres";
    let headers = new Headers();
    this.createAuthorizationHeader(headers, { token: token, contentType: "application/json", accept: "application/json" });
    return this.http.post(request_url, request_data, {
      headers: headers
    });
  }

  // Détail d'une offre
  detailOffreEmploi(token, offerId): Observable<any> {
    let url_detail_offre = 'https://api.emploi-store.fr/partenaire/offresdemploi/v1/offres/' + offerId;
    let headers = new Headers();
    this.createAuthorizationHeader(headers, { token: token, contentType: "application/x-www-form-urlencoded", accept: null });
    return this.http.get(url_detail_offre, {
      headers: headers
    });
  }

  // Retourne référentiel (fichier stocké) des appellations métiers POLE EMPLOI
  getRefAppellation(): EmploiRefAppellation[] {
    return REF_APPELLATION;
  }

  // Méthode permettant de retourner des listes de référentiels
  getReferentielListe(token): Observable<any> {
    let url = "https://api.emploi-store.fr/partenaire/infotravail/v1/resource_search?query=pe_type:reference";
    let headers = new Headers();
    this.createAuthorizationHeader(headers, {token: token, contentType: "application/x-www-form-urlencoded", accept: null});
    return this.http.get(url, {
      headers: headers
    });
  }

  // Méthode permettant de retourner des listes de référentiels
  getReferentielContenu(token, referentiel_id, limit = 70000, offset = 0): Observable<any> {
    //console.log(" --- EmploiStoreService | getReferentielContenu ---", referentiel_id);
    let url = "https://api.emploi-store.fr/partenaire/infotravail/v1/datastore_search?resource_id="+referentiel_id+"&limit="+limit+"&offset="+offset;
    let headers = new Headers();
    this.createAuthorizationHeader(headers, {token: token, contentType: "application/x-www-form-urlencoded", accept: null});
    return this.http.get(url, {
      headers: headers
    });
  }


  getCountryAvailable(){
    const country = [
      {name: "ALLEMAGNE (Frontalier)", code: "03"},
      {name: "BELGIQUE (Frontalier)", code: "05"},
      {name: "ESPAGNE (Frontalier)", code: "08"},
      {name: "ITALIE (Frontalier)", code: "15"},
      {name: "LUXEMBOURG (Frontalier)", code: "17"},
      {name: "ROYAUME-UNI (Frontalier)", code: "10"},
      {name: "SUISSE (Frontalier)", code: "24"}
    ];
    return country;
  }


  // test -- pas utilisé à priori
  getListeOffreByCritere(){
    this.getToken().subscribe(
      promiseToken => (
        this.myTokenObject = JSON.parse(promiseToken["_body"]),
        this.listeOffreEmploi = this.searchOffresEmploi(this.myTokenObject.access_token, this.searchParam).map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data()
            return data;

/*
            const data = a.payload.doc.data() as UserBibliotheque;
            var storageRef = this.afStorage.ref(data.fileStorageFullPath);
            storageRef.getMetadata().subscribe(storeData => {
              data.storage = storeData;
            });
            data.uid = a.payload.doc.id;
            return data;*/

          });
        })

      ),
      error => console.log("Error :: " + error)
    );
  }

}