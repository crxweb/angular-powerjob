import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

@Injectable()
export class OpendatasoftService {

  constructor(private http: Http) {}

  /**
   * Récupération informations via ville et raison sociale
   * @param raison_sociale 
   * @param ville 
   */
  getSirenInfoByLocRS(raison_sociale, ville): Observable<any> {
    let rs = raison_sociale.replace(/ /g, "+");
    console.log('rs search request: '+rs);
    let url_opendata_siren = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=sirene%40public&facet=depet&facet=libcom&facet=siege&facet=saisonat&facet=libnj&facet=libapen&facet=libtefen&facet=categorie&facet=proden&facet=vmaj1&facet=vmaj2&facet=vmaj3&facet=liborigine&facet=libtca&facet=libreg_new&facet=l1_normalisee&facet=codpos&refine.libcom="+ville+"&refine.l1_normalisee="+rs;
    let headers = new Headers();
    return this.http.get(url_opendata_siren, {
      headers: headers
    });
  }

  /**
   * Retourne ville INSEE par code postal
   * @param code_postal 
   */
  getVillesByCp(code_postal): Observable<any> {
    //let url_opendata_siren = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=correspondance-code-insee-code-postal&facet=postal_code&refine.postal_code="+code_postal;
    let url_opendata_siren = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=correspondance-code-insee-code-postal&q="+code_postal+"&facet=insee_com&facet=nom_dept&facet=nom_region&facet=statut";
    let headers = new Headers();
    return this.http.get(url_opendata_siren, {
      headers: headers
    });
  }
  

  /**
   * Retourne jeux de données Insee DADS (Déclaration Annuelle de données sociales)
   * @param naf_intitule (string -> activityName vs code naf: activityCode)
   */
  getDadsByNafIntitule(naf_intitule): Observable<any> {
    //let url_opendata_siren = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=declaration-annuelles-de-donnees-sociales-dads-etablissements&q=Conseil+en+syst%C3%A8mes+et+logiciels+informatiques&sort=annee&facet=annee&facet=code_naf&facet=intitule_naf";
    let url_opendata_siren = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=declaration-annuelles-de-donnees-sociales-dads-etablissements&q="+naf_intitule+"&sort=annee&facet=annee&facet=code_naf&facet=intitule_naf";
    let headers = new Headers();
    return this.http.get(url_opendata_siren, {
      headers: headers
    });
  }
}
