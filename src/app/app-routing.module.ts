import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggerManagementFormComponent } from './pages/logger-management-form/logger-management-form.component';


const routes: Routes = [
  { path: '', component:LoggerManagementFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/logger' },
  ],
})
export class AppRoutingModule { }
export const loggerComponentDeclaration = [
  LoggerManagementFormComponent
]