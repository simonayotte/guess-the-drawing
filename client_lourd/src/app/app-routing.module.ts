import {APP_BASE_HREF} from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameActivityComponent } from './components/app/game-activity/game-activity.component';
import { ConversationComponent } from './components/app/interface/conversation/conversation.component';
import { GuideComponent } from './components/app/interface/guide/guide.component';
import { HomeComponent } from './components/app/interface/home/home.component';
import { MainMenuComponent } from './components/app/interface/main-menu/main-menu.component';
import { WordImageComponent } from './components/app/interface/word-image/word-image.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  { path: 'draw', component: GameActivityComponent, canActivate: [AuthGuardService]},
  { path: 'chat', component: ConversationComponent},
  { path: 'menu', component: MainMenuComponent, canActivate: [AuthGuardService]},
  { path: 'guide', component: GuideComponent, canActivate: [AuthGuardService]},
  { path: 'word-image', component: WordImageComponent, canActivate: [AuthGuardService]},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [
    {provide: APP_BASE_HREF, useValue : '/' }
  ]
})
export class AppRoutingModule { }
