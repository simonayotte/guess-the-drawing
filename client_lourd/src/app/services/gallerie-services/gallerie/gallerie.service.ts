import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GraphicsManager } from 'src/app/components/app/tools/graphics/graphics-manager';
import { SvgManager } from 'src/app/components/app/tools/graphics/svg-manager';
import { MetaDataDB } from '../../../models/meta-data-bd';
import { SelectedColorsService } from '../../color-picker/selected-colors.service';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { DrawingSizeService } from '../../drawing/drawing-size.service';
import { ExporterService } from '../../exporter-service/exporter.service';
import { GallerieDrawingService } from '../gallerie-drawing/gallerie-drawing.service';
import { SvgStringManipulationService } from '../svgStringManipulation/svg-string-manipulation.service';

const drawUrl = '/draw';

@Injectable({
  providedIn: 'root'
})
export class GallerieService {

  private metaDataDB: MetaDataDB[] = [];
  private graphicsManager: GraphicsManager = new GraphicsManager();

  constructor(private httpCient: HttpClient,
              private gallerieDrawingService: GallerieDrawingService,
              private drawingSizeService: DrawingSizeService,
              private selectedColors: SelectedColorsService,
              private router: Router,
              private exporterService: ExporterService,
              private continueDrawingService: ContinueDrawingService) {}

  getMetaData(): MetaDataDB[] {
    return this.metaDataDB;
  }

  setDrawings(metaData: MetaDataDB[]): void {
    this.metaDataDB = [];
    for ( const d of metaData) {
      this.metaDataDB.push({
        _id: d._id,
        name: d.name,
        tags: d.tags,
        imageData: d.imageData
      });
    }
  }

  isDrawings(metaDataBD: MetaDataDB[]): boolean {
    if (metaDataBD.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  deleteDrawing(id: string, tags: string[]): MetaDataDB[] {
    this.httpCient.delete<void>('http://localhost:3000/database/id/' + id).subscribe();
    this.metaDataDB.splice(this.metaDataDB.findIndex((element) => element._id === id), 1);
    return this.tagSearch(tags);
  }

  getAllDrawingHTTP(): Observable<MetaDataDB[]> {
    return this.httpCient.get<MetaDataDB[]>('http://localhost:3000/database/metadata');
  }

  loadPreviewImages( document: Document): void {
    for (const m of this.metaDataDB) {
      const canvas = document.getElementById(m._id) as HTMLCanvasElement;

      if (canvas !== null) {
        const svg = SvgManager.fromB64Str(m.imageData);
        this.exporterService.updatePreviewCanvas(svg, canvas);
        this.graphicsManager.svgToCanvas(svg, canvas, false);
      }
    }
  }

  tagSearch(tags: string[]): MetaDataDB[] {
    if (tags.length > 0) {
      const metaDataReturn: MetaDataDB[] = [];
      for (const m of this.metaDataDB) {
        for (const tag of tags) {
          if ( m.tags.find( (element) => element === tag) !== undefined) {
            metaDataReturn.push(m);
            break;
          }
        }
      }
      return metaDataReturn;
    } else {
      return this.metaDataDB;
    }
  }

  openDrawing(metaDataDB: MetaDataDB): void {
    const svgString = SvgManager.getStringFromB64(metaDataDB.imageData);
    this.gallerieDrawingService.setValuesWithSvgString(svgString);
    this.drawingSizeService.updateHeight(SvgStringManipulationService.getHeight(svgString));
    this.drawingSizeService.updateWidth(SvgStringManipulationService.getWidth(svgString));
    this.selectedColors.backgroundColorBS.next(SvgStringManipulationService.getBackGroundColor(svgString));
    this.router.navigateByUrl(drawUrl);
    this.continueDrawingService.autoSaveDrawing();
  }

}
