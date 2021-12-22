import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

@Injectable()
export class GeoapigouvfrService {

  constructor(private http: Http) {}

  /**
   * Récupération liste des départements FRANCE
   */
  getDepartementsListe(): Observable<any> {
    let url_opendata_siren = "https://geo.api.gouv.fr/departements";
    let headers = new Headers();
    return this.http.get(url_opendata_siren, {
      headers: headers
    });
  }

    /**
   * Récupération liste des régions FRANCE
   */
  getRegionsListe(): Observable<any> {
    let url_opendata_siren = "https://geo.api.gouv.fr/regions";
    let headers = new Headers();
    return this.http.get(url_opendata_siren, {
      headers: headers
    });
  }

}

