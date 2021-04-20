import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingMainComponent } from './components/app/drawing-main/drawing-main.component';
import { DrawingComponent } from './components/app/drawing-main/drawing/drawing.component';
import { ToolbarComponent } from './components/app/drawing-main/toolbar/toolbar.component';
import { GridComponent } from './components/app/interface/grid/grid.component';
import { HomeComponent } from './components/app/interface/home/home.component';
import { LastSelectedColorsComponent } from './components/app/interface/last-selected-colors/last-selected-colors.component';
import { ColorPaletteComponent } from './components/app/tools/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/app/tools/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/app/tools/color-picker/color-slider/color-slider.component';
import { DrawingToolComponent } from './components/app/tools/drawingTools/drawing-tool/drawing-tool.component';
import { PencilComponent } from './components/app/tools/drawingTools/pencil/pencil.component';
import { EraserComponent } from './components/app/tools/eraser/eraser.component';
import { GridAttributesComponent } from './components/app/tools/grid-attributes/grid-attributes.component';
import { ToolButtonsComponent } from './components/app/tools/tool-buttons/tool-buttons.component';
import { MaterialModule } from './material/material.module';
import { DrawingSizeService } from './services/drawing/drawing-size.service';
import { SaveDrawingService } from './services/drawing/save-drawing.service';
import { ExporterService } from './services/exporter-service/exporter.service';
import { SelectedToolService } from './services/selected-tool/selected-tool.service';
import { SvgService } from './services/svg-service/svg.service';
import { PathDrawingService } from './services/tools/path-drawing/path-drawing.service';
import { PencilService } from './services/tools/pencil-service/pencil.service';
import { BasicDialogComponent } from './components/app/interface/basic-dialog/basic-dialog.component';
import { ConversationComponent } from './components/app/interface/conversation/conversation.component';
import { MainMenuComponent } from './components/app/interface/main-menu/main-menu.component';
import { WordImageComponent } from './components/app/interface/word-image/word-image.component';
import { WindowChatComponent } from './components/app/interface/window-chat/window-chat.component';
import { UserProfileComponent } from './components/app/interface/user-profile/user-profile.component';
import { CreateLobbyDialog, LobbyListComponent } from './components/app/interface/lobby/lobby-list/lobby-list.component';
import { LobbyComponent } from './components/app/interface/lobby/lobby/lobby.component';
import { GameLeaderboardComponent } from './components/app/drawing-main/gameLeaderboard/gameLeaderboard.component';
import { GameActivityComponent } from './components/app/game-activity/game-activity.component';
import { LeaderboardComponent } from './components/app/interface/leaderboard/leaderboard.component';
import { ImageDragDirective } from './components/app/interface/image-upload/ImageDrag/image-drag.directive';
import { WordImagePreviewComponent } from './components/app/interface/word-image-preview/word-image-preview.component';
import { InfoDialogComponent } from './components/app/interface/info-dialog/info-dialog.component';
import { EndGameDialogComponent } from './components/app/interface/end-game-dialog/end-game-dialog.component';
import { ConfettiComponent } from './components/app/effects/confetti/confetti.component';
import { GuideComponent } from './components/app/interface/guide/guide.component';
import { ThumbsUpComponent } from './components/app/interface/thumbs-up/thumbs-up.component';

@NgModule({
    declarations: [
      AppComponent,
      HomeComponent,
      ConversationComponent,
      DrawingMainComponent,
      ToolbarComponent,
      DrawingComponent,
      ToolButtonsComponent,
      DrawingToolComponent,
      PencilComponent,
      ColorPickerComponent,
      ColorSliderComponent,
      ColorPaletteComponent,
      LastSelectedColorsComponent,
      GameLeaderboardComponent,
      EraserComponent,
      GridComponent,
      GridAttributesComponent,
      BasicDialogComponent,
      MainMenuComponent,
      BasicDialogComponent,
      WindowChatComponent,
      UserProfileComponent,
      WordImageComponent,
      ImageDragDirective,
      WordImagePreviewComponent,
      LobbyListComponent,
      CreateLobbyDialog,
      LobbyComponent,
      LeaderboardComponent,
      GameActivityComponent,
      InfoDialogComponent,
      EndGameDialogComponent,
      ConfettiComponent,
      GuideComponent,
      ThumbsUpComponent
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      NoopAnimationsModule,
      MaterialModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      ReactiveFormsModule,
      MatTableModule,
      MatSortModule
    ],
    providers: [
      PencilService,
      PencilComponent,
      PathDrawingService,
      DrawingSizeService,
      SelectedToolService,
      SvgService,
      ExporterService,
      SaveDrawingService,
      EraserComponent,
      GridAttributesComponent,
      GridComponent
    ],
    bootstrap: [AppComponent],
})

export class AppModule {}
