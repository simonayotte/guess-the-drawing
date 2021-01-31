import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingMainComponent } from './components/app/drawing-main/drawing-main.component';
import { DrawingComponent } from './components/app/drawing-main/drawing/drawing.component';
import { ToolbarComponent } from './components/app/drawing-main/toolbar/toolbar.component';
import { ExporterComponent } from './components/app/exporter/exporter.component';
import { DialogDismissDrawingComponent } from './components/app/interface/dialog-dismiss-drawing/dialog-dismiss-drawing.component';
import { DialogNewDrawingComponent } from './components/app/interface/dialog-new-drawing/dialog-new-drawing.component';
import { GallerieComponent } from './components/app/interface/gallerie/gallerie.component';
import { GridComponent } from './components/app/interface/grid/grid.component';
import { HomeComponent } from './components/app/interface/home/home.component';
import { LastSelectedColorsComponent } from './components/app/interface/last-selected-colors/last-selected-colors.component';
import { SaveDrawingComponent } from './components/app/interface/save-drawing/save-drawing/save-drawing.component';
import { PageNotFoundComponent } from './components/app/page-not-found/page-not-found.component';
import { ColorPaletteComponent } from './components/app/tools/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/app/tools/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/app/tools/color-picker/color-slider/color-slider.component';
import { DrawingToolComponent } from './components/app/tools/drawingTools/drawing-tool/drawing-tool.component';
import { PencilComponent } from './components/app/tools/drawingTools/pencil/pencil.component';
import { EraserComponent } from './components/app/tools/eraser/eraser.component';
import { GridAttributesComponent } from './components/app/tools/grid-attributes/grid-attributes.component';
import { ToolButtonsComponent } from './components/app/tools/tool-buttons/tool-buttons.component';
import { MenuTreeComponent } from './components/app/user-guide/menu-tree/menu-tree.component';
import { UserGuideComponent } from './components/app/user-guide/user-guide/user-guide.component';
import { MaterialModule } from './material/material.module';
import { DrawingSizeService } from './services/drawing/drawing-size.service';
import { SaveDrawingService } from './services/drawing/save-drawing.service';
import { ExporterService } from './services/exporter-service/exporter.service';
import { SelectedToolService } from './services/selected-tool/selected-tool.service';
import { SvgService } from './services/svg-service/svg.service';
import { PathDrawingService } from './services/tools/path-drawing/path-drawing.service';
import { PencilService } from './services/tools/pencil-service/pencil.service';
import { UserGuideService } from './services/user-guide/user-guide.service';

@NgModule({
    declarations: [
      AppComponent,
      HomeComponent,
      PageNotFoundComponent,
      DrawingMainComponent,
      ToolbarComponent,
      DrawingComponent,
      ToolButtonsComponent,
      MenuTreeComponent,
      UserGuideComponent,
      DialogNewDrawingComponent,
      DrawingToolComponent,
      PencilComponent,
      SaveDrawingComponent,
      ColorPickerComponent,
      ColorSliderComponent,
      ColorPaletteComponent,
      DialogDismissDrawingComponent,
      LastSelectedColorsComponent,
      ExporterComponent,
      GallerieComponent,
      EraserComponent,
      GridComponent,
      GridAttributesComponent
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      NoopAnimationsModule,
      MaterialModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      ReactiveFormsModule
    ],
    providers: [
      UserGuideService,
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
