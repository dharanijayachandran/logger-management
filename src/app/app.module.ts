import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainInterceptor } from "../app/main-interceptor";
import { AppRoutingModule, loggerComponentDeclaration } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalModule, PendingChangesGuard } from "global";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { MatTablePaginatorComponent } from './shared/components/mat-table-paginator/mat-table-paginator.component';
import { ExportFilesToComponent } from './shared/components/export-files-to/export-files-to.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DropDownTreeModule } from '@syncfusion/ej2-angular-dropdowns';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    ExportFilesToComponent,
    MatTablePaginatorComponent,
    loggerComponentDeclaration

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTreeModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule,
    AngularDualListBoxModule,
    DropDownListModule,
    DropDownTreeModule,
    GlobalModule,
    AppRoutingModule,
    AngularMultiSelectModule,
    MatSortModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    PendingChangesGuard,
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check-indeterminate', color: 'primary' } as MatCheckboxDefaultOptions }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
