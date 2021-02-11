import {APP_BASE_HREF} from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DrawingMainComponent } from './components/app/drawing-main/drawing-main.component';
import { ConversationComponent } from './components/app/interface/conversation/conversation.component';
import { HomeComponent } from './components/app/interface/home/home.component';
import { MainMenuComponent } from './components/app/interface/main-menu/main-menu.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'draw', component: DrawingMainComponent},
  { path: 'convo', component: ConversationComponent},
  { path: 'menu', component: MainMenuComponent, canActivate: [AuthGuardService]},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: APP_BASE_HREF, useValue : '/' }
  ]
})
export class AppRoutingModule { }
