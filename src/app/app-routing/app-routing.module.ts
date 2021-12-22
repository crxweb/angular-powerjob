import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../core/admin.guard';
import { CanReadGuard } from '../core/can-read.guard';
// Components
import { HomeComponent } from "./../appcomponents/home/home.component";
import { LoginComponent } from "./../appcomponents/login/login.component";
import { CreateAccountComponent } from "./../appcomponents/create-account/create-account.component";
import { BibliothequeComponent } from "./../appcomponents/bibliotheque/bibliotheque.component";
import { MoncompteComponent } from "./../appcomponents/moncompte/moncompte.component";
import { EmploiSearchFormComponent } from "./../appcomponents/emploi-search-form/emploi-search-form.component";
import { EmploiSearchResultsComponent } from "./../appcomponents/emploi-search-results/emploi-search-results.component";

import { EmploiSearchResultsSimpleComponent } from "./../appcomponents/emploi-search-results-simple/emploi-search-results-simple.component";

// copie fonctionnelle -- a supprimer , remplacé par BibliothequeAjouterComponent
import { BibliothequeAddComponent } from "./../appcomponents/bibliotheque-add/bibliotheque-add.component";

import { BibliothequeAjouterComponent } from "./../appcomponents/bibliotheque-ajouter/bibliotheque-ajouter.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'createAccount', component: CreateAccountComponent},
  { path: 'moncompte', component: MoncompteComponent, canActivate: [CanReadGuard]},
  { path: 'bibliotheque', component: BibliothequeComponent, canActivate: [CanReadGuard]},
  { path: 'emploiSearchForm', component: EmploiSearchFormComponent, canActivate: [CanReadGuard]},
  { path: 'emploiSearchResults/:idCritere/:searchType', component: EmploiSearchResultsComponent, canActivate: [CanReadGuard]},

  { path: 'emploiSearchResultsSimple/:idCritere/:searchType', component: EmploiSearchResultsSimpleComponent, canActivate: [CanReadGuard]},
  
  // copie travaille fonctionnelle
  { path: 'bibliothequeAdd', component: BibliothequeAddComponent, canActivate: [CanReadGuard]},
  { path: 'bibliothequeAjouter', component: BibliothequeAjouterComponent, canActivate: [CanReadGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }