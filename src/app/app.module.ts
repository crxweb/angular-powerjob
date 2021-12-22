import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorsComponent } from "./form/errors.component";
import { HttpClientModule }    from '@angular/common/http';
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { environment } from '../environments/environment';

// Core module - Authentification
import { CoreModule } from "./core/core.module";


// Shared
import { NavigationComponent } from "./shared/navigation/navigation.component";
import { FooterComponent } from './shared/footer/footer.component';

import { ModalContentComponent } from "./shared/modal/modal.component";
import { ModalConfirmComponent } from "./shared/modal-confirm/modal-confirm.component";
import { ModalDefaultComponent } from "./shared/modal-default/modal-default.component";

// PrimeNG
import {CardModule} from 'primeng/card';
import {ChartModule} from 'primeng/chart';
import {FileUploadModule} from 'primeng/fileupload';
import {FieldsetModule} from 'primeng/fieldset';
import {TabViewModule} from 'primeng/tabview';
import {ScheduleModule} from 'primeng/schedule';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DropdownModule} from 'primeng/dropdown';
import {ChipsModule} from 'primeng/chips';
import {SelectButtonModule} from 'primeng/selectbutton';
import {InputMaskModule} from 'primeng/inputmask';
import {SliderModule} from 'primeng/slider';
import {CheckboxModule} from 'primeng/checkbox';
import {MultiSelectModule} from 'primeng/multiselect';

// Imports ngx-bootstrap
import { BsDropdownModule, TooltipModule, ModalModule, CollapseModule, TypeaheadModule } from "ngx-bootstrap";

// Imports ngx-datatable
import { NgxDatatableModule } from "@swimlane/ngx-datatable";


// AngularFire
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';

// Services
import { UsersService } from "./service/firestore/users.service";
import { EmploiService } from "./service/firestore/emploi.service";
import { BibliothequeService } from "./service/firestore/bibliotheque.service";
import { OffresEmploiService } from "./service/emploi-store/offres-emploi.service";
import { OpendatasoftService } from "./service/opendatasoft.service";
import { GeoapigouvfrService } from "./service/geoapigouvfr.service";

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from "./appcomponents/home/home.component";
import { LoginComponent } from "./appcomponents/login/login.component";
import { CreateAccountComponent } from './appcomponents/create-account/create-account.component';
import { BibliothequeComponent } from './appcomponents/bibliotheque/bibliotheque.component';
import { BibliothequeAddComponent } from './appcomponents/bibliotheque-add/bibliotheque-add.component';
import { BibliothequeAjouterComponent } from './appcomponents/bibliotheque-ajouter/bibliotheque-ajouter.component';
import { MoncompteComponent } from './appcomponents/moncompte/moncompte.component';
import { EmploiSearchResultsComponent } from './appcomponents/emploi-search-results/emploi-search-results.component';
import { EmploiSearchFormComponent } from './appcomponents/emploi-search-form/emploi-search-form.component';

// Pipes
import { TemplatePipePipe } from './pipe/template-pipe.pipe';
import { DatePipe } from '@angular/common';
import { FilesPipe } from './pipe/files.pipe';
import { EmploiStorePipe } from './pipe/emploi-store.pipe';
import { EmploiSearchResultsSimpleComponent } from './appcomponents/emploi-search-results-simple/emploi-search-results-simple.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorsComponent,

    // Shared
    NavigationComponent,
    FooterComponent,
    ModalDefaultComponent,
    ModalContentComponent,
    ModalConfirmComponent,

    // Components
    HomeComponent,
    LoginComponent,
    CreateAccountComponent,
    BibliothequeComponent,

    // Pipes
    TemplatePipePipe,
    FilesPipe,
    BibliothequeAddComponent,
    BibliothequeAjouterComponent,
    MoncompteComponent,
    EmploiSearchResultsComponent,
    EmploiSearchFormComponent,
    EmploiStorePipe,
    EmploiSearchResultsSimpleComponent

  ],
  entryComponents: [
    ModalContentComponent,
    ModalConfirmComponent,
    ModalDefaultComponent
  ],
  
  imports: [
    // Commons
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpModule,

    // Core module
    CoreModule,
    
    // PrimeNG
    CardModule,
    ChartModule,
    FileUploadModule,
    FieldsetModule,
    TabViewModule,
    ScheduleModule,
    ProgressSpinnerModule,
    DropdownModule,
    ChipsModule,
    SelectButtonModule,
    InputMaskModule,
    SliderModule,
    CheckboxModule,
    MultiSelectModule,

    // AngularFire2
    AngularFireModule.initializeApp(environment.firebase),
    //AngularFirestoreModule.enablePersistence(), ///// OFF LINE DATA
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,

    // NGX-BOOTSTRAP
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    TypeaheadModule.forRoot(),

    // NGX-DATATABLE
    NgxDatatableModule

  ],
  providers: [
    UsersService,
    EmploiService,
    BibliothequeService,
    OffresEmploiService,
    OpendatasoftService,
    GeoapigouvfrService,
    TemplatePipePipe,
    DatePipe,
    FilesPipe,
    EmploiStorePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
