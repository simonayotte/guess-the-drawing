import {APP_BASE_HREF} from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DrawingMainComponent } from './components/app/drawing-main/drawing-main.component';
import { HomeComponent } from './components/app/interface/home/home.component';
import { PageNotFoundComponent } from './components/app/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'draw', component: DrawingMainComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: APP_BASE_HREF, useValue : '/' }
  ]
})
export class AppRoutingModule { }
