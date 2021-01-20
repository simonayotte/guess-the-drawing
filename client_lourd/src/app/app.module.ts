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
import { AerosolComponent } from './components/app/tools/aerosol-tool/aerosol/aerosol.component';
import { ColorApplicatorComponent } from './components/app/tools/color-applicator/color-applicator.component';
import { ColorPaletteComponent } from './components/app/tools/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/app/tools/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/app/tools/color-picker/color-slider/color-slider.component';
import { DrawingToolComponent } from './components/app/tools/drawingTools/drawing-tool/drawing-tool.component';
import { PaintBrushComponent } from './components/app/tools/drawingTools/paint-brush/paint-brush.component';
import { PencilComponent } from './components/app/tools/drawingTools/pencil/pencil.component';
import { EraserComponent } from './components/app/tools/eraser/eraser.component';
import { GridAttributesComponent } from './components/app/tools/grid-attributes/grid-attributes.component';
import { LineToolComponent } from './components/app/tools/line-tool/line-tool.component';
import { PaintBucketComponent } from './components/app/tools/paint-bucket/paint-bucket.component';
import { PipetteComponent } from './components/app/tools/pipette/pipette.component';
import { SelectionToolComponent } from './components/app/tools/selection-tool/selection-tool.component';
import { EllipseComponent } from './components/app/tools/shapeTools/ellipse/ellipse/ellipse.component';
import { PolygoneComponent } from './components/app/tools/shapeTools/polygone/polygone/polygone.component';
import { RectangleToolComponent } from './components/app/tools/shapeTools/rectangle-tool/rectangle-tool.component';
import { ShapeToolComponent } from './components/app/tools/shapeTools/shape-tool/shape-tool.component';
import { ToolButtonsComponent } from './components/app/tools/tool-buttons/tool-buttons.component';
import { MenuTreeComponent } from './components/app/user-guide/menu-tree/menu-tree.component';
import { UserGuideComponent } from './components/app/user-guide/user-guide/user-guide.component';
import { MaterialModule } from './material/material.module';
import { DrawingSizeService } from './services/drawing/drawing-size.service';
import { SaveDrawingService } from './services/drawing/save-drawing.service';
import { ExporterService } from './services/exporter-service/exporter.service';
import { SelectedToolService } from './services/selected-tool/selected-tool.service';
import { SvgService } from './services/svg-service/svg.service';
import { EllipseService } from './services/tools/ellipse/ellipse.service';
import { LineService } from './services/tools/line-service/line.service';
import { PaintBrushService } from './services/tools/paintbrush-service/paint-brush.service';
import { PathDrawingService } from './services/tools/path-drawing/path-drawing.service';
import { PencilService } from './services/tools/pencil-service/pencil.service';
import { PolygoneService } from './services/tools/polygone-service/polygone.service';
import { RectangleService } from './services/tools/rectangle-service/rectangle.service';
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
      PaintBrushComponent,
      SaveDrawingComponent,
      ShapeToolComponent,
      RectangleToolComponent,
      PolygoneComponent,
      EllipseComponent,
      LineToolComponent,
      ColorPickerComponent,
      ColorSliderComponent,
      ColorPaletteComponent,
      DialogDismissDrawingComponent,
      LastSelectedColorsComponent,
      ExporterComponent,
      SelectionToolComponent,
      GallerieComponent,
      EraserComponent,
      AerosolComponent,
      GridComponent,
      PaintBucketComponent,
      PipetteComponent,
      ColorApplicatorComponent,
      GridAttributesComponent
    ],
    entryComponents: [
      DialogNewDrawingComponent,
      UserGuideComponent,
      PencilComponent,
      SelectionToolComponent,
      PaintBrushComponent,
      RectangleToolComponent,
      PolygoneComponent,
      EllipseComponent,
      LineToolComponent,
      DialogDismissDrawingComponent,
      ColorPickerComponent,
      ExporterComponent,
      SaveDrawingComponent,
      GallerieComponent,
      EraserComponent,
      AerosolComponent,
      PaintBucketComponent,
      PipetteComponent,
      ColorApplicatorComponent,
      GridAttributesComponent,
      GridComponent
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
      PolygoneService,
      PolygoneComponent,
      EllipseComponent,
      EllipseService,
      UserGuideService,
      PencilService,
      PaintBrushService,
      RectangleService,
      PencilComponent,
      PaintBrushComponent,
      RectangleToolComponent,
      SelectionToolComponent,
      LineToolComponent,
      PathDrawingService,
      LineService,
      DrawingSizeService,
      SelectedToolService,
      SvgService,
      ExporterService,
      SaveDrawingService,
      EraserComponent,
      AerosolComponent,
      PaintBucketComponent,
      PipetteComponent,
      ColorApplicatorComponent,
      GridAttributesComponent,
      GridComponent
    ],
    bootstrap: [AppComponent],
})

export class AppModule {}
