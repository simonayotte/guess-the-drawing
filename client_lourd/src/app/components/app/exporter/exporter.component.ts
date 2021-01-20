import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExporterService } from '../../../services/exporter-service/exporter.service';
import { SvgService } from '../../../services/svg-service/svg.service';
import {
  GRAYSCALE_VIEW,
  HIGH_BRIGHTNESS_VIEW,
  INVERTED_VIEW,
  JPG_VIEW,
  LOW_BRIGHTNESS_VIEW,
  NONE_VIEW,
  OPACITY_VIEW,
  PNG_VIEW,
  STYLE_ATTRIBUTE,
  SVG_VIEW,
} from '../tools/graphics/graphics-constants';
import { EXTENSIONS } from '../tools/graphics/graphics-factory/extension-factory';
import { Filter, GraphicFormat } from '../tools/graphics/graphics-types';
import { SvgManager } from '../tools/graphics/svg-manager';

const DEFAULT_FILE_NAME = 'SansTitre';
const DESTINATIONS = {local: 'local', email: 'email'};
const FILTER_ATTRIBUTE = 'filter';

const ALERT_INVALID_EMAIL = "Le format de l'adresse courriel est invalide.";

interface ExportFormat {
  value: GraphicFormat;
  viewValue: string;
}

interface CanvasFilter {
  value: Filter;
  viewValue: string;
}

@Component({
  selector: 'app-exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.scss']
})
export class ExporterComponent implements OnInit {
  @ViewChild('download', {static: true})
  download: ElementRef<HTMLAnchorElement>;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('exportCanvas', {static: true})
  exportCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('exportGRef', {static: true})
  exportGRef: ElementRef<SVGGElement>;

  @ViewChild('filterSvg', {static: true})
  filterSvg: ElementRef<SVGElement>;

  formats: ExportFormat[] = [
    {value: GraphicFormat.PNG, viewValue: PNG_VIEW},
    {value: GraphicFormat.JPG, viewValue: JPG_VIEW},
    {value: GraphicFormat.SVG, viewValue: SVG_VIEW}
  ];

  filters: CanvasFilter[] = [
    {value: Filter.NONE, viewValue: NONE_VIEW},
    {value: Filter.GRAYSCALE, viewValue: GRAYSCALE_VIEW},
    {value: Filter.INVERTED, viewValue: INVERTED_VIEW},
    {value: Filter.HIGH_BRIGHTNESS, viewValue: HIGH_BRIGHTNESS_VIEW},
    {value: Filter.LOW_BRIGHTNESS, viewValue: LOW_BRIGHTNESS_VIEW},
    {value: Filter.OPACITY, viewValue: OPACITY_VIEW}
  ];

  selectedDestination: string;
  selectedFormat: GraphicFormat;
  email: string;
  svgElement: SVGElement;
  selectedFilter: Filter;
  exportSvgElement: SVGElement;
  fileName: string;
  displayAlertErr: boolean;
  displayAlertSucc: boolean;
  alert: string;

  constructor(private exporterService: ExporterService, private svgService: SvgService) {
    this.selectedDestination = DESTINATIONS.local;
    this.selectedFormat = this.formats[0].value;
    this.selectedFilter = this.filters[0].value;
    this.fileName = DEFAULT_FILE_NAME;
    this.displayAlertErr = false;
    this.displayAlertSucc = false;

    this.exporterService.emailAlert.subscribe((value) => {
      this.updateAlert(value.msg,
                     Boolean(value.msg) || this.selectedDestination === DESTINATIONS.email,
                            value.err);
    });
  }

  ngOnInit(): void {
    this.exportSvgElement = SvgManager.clone(this.filterSvg.nativeElement);
    SvgManager.setHidden(this.filterSvg.nativeElement, true);
    this.svgService.svgSubject.subscribe((svg) => {
      this.svgElement = svg;
      this.replaceGSvg();
    });
    this.setFilter();
  }

  exportSvg(): void {
    const outElement = (this.selectedFormat === GraphicFormat.SVG) ? this.exportSvgElement : this.exportCanvas.nativeElement;
    const filename = this.fileName + '.' + EXTENSIONS[this.selectedFormat];
    if (this.selectedDestination === DESTINATIONS.local) {
      this.download.nativeElement.href = this.exporterService.exportLocally(outElement, this.selectedFormat);
      this.download.nativeElement.download = filename;
      this.download.nativeElement.click();
    } else {
      if (this.exporterService.validateEmail(this.email)) {
        this.exporterService.exportEmail(outElement, this.selectedFormat, this.email, filename);
      } else {
        this.validateEmail();
      }
    }
  }

  replaceGSvg(): void {
    const gExportElement = this.exportSvgElement.querySelector('#gElement');

    if (gExportElement) {
      SvgManager.resize(this.exportSvgElement, SvgManager.getDimensions(this.svgElement));
      gExportElement.childNodes.forEach((child) => gExportElement.removeChild(child));
      gExportElement.appendChild(SvgManager.clone(this.svgElement));
      const svgStyle = (gExportElement.firstChild as SVGElement).getAttribute(STYLE_ATTRIBUTE);

      if (svgStyle) {
        SvgManager.setStyle(this.exportSvgElement, svgStyle);
      }
    }
  }

  applyFilterToSvg(svg: SVGElement, filter: Filter): void {
    if (filter === Filter.NONE) {
      svg.removeAttribute(FILTER_ATTRIBUTE);
    } else {
      SvgManager.setFilter(svg, filter);
    }
  }

  setFilter(): void {
    const gExportElement = this.exportSvgElement.querySelector('#gElement') as SVGGElement;

    if (gExportElement) {
      this.applyFilterToSvg(gExportElement, this.selectedFilter);

      this.exporterService.updatePreviewCanvas(this.exportSvgElement, this.canvas.nativeElement);
      this.exporterService.updateExportCanvas(this.exportSvgElement, this.exportCanvas.nativeElement);
    }
  }

  validateEmail(): void {
    this.updateAlert(ALERT_INVALID_EMAIL, !this.exporterService.validateEmail(this.email), true);
  }

  updateAlert(message: string, display: boolean, error: boolean): void {
    this.alert = message;
    this.displayAlertErr = error && display;
    this.displayAlertSucc = !error && display;
  }
}
