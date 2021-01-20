import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GraphicFormat, IDimensions } from '../../components/app/tools/graphics/graphics-types';
import { SvgManager } from '../../components/app/tools/graphics/svg-manager';
import { ExporterService } from './exporter.service';

const GET_ASPECT_RATIO = 'getAspectRatio';
const SVG_TO_CANVAS = 'svgToCanvas';
const GET_URL = 'getUrl';
const HTTP = 'http';
const POST = 'post';
const CANVAS = 'canvas';
const GRAPHICAL_MANAGER = 'graphicalManager';

const FAKE_STR = 'str';

const FAKE_EMAIL = 'aaa@aaa.com';
const FAKE_INVALID_EMAIL = 'fffff';

const FAKE_SVG = {
  // fake obj
} as unknown as SVGElement;

const FAKE_CANVAS = {
  // fake obj
} as unknown as HTMLCanvasElement;

const FAKE_DIMENSIONS = {
  width: 0.5,
  height: 1
} as IDimensions;

describe('ExporterService', () => {
  let service: ExporterService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  beforeEach(() => {
    service = TestBed.get(ExporterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exportLocally should call getUrl from GraphicsManager', () => {
    spyOn(service.graphicalManager, GET_URL);

    service.exportLocally(FAKE_SVG, GraphicFormat.SVG);

    expect(service.graphicalManager.getUrl).toHaveBeenCalled();
  });

  it('exportEmail should call getUrl from GraphicsManager', () => {
    const fakeCanvas = document.createElement(CANVAS);
    const spyURL = spyOn(service[GRAPHICAL_MANAGER], GET_URL);
    const spyGet = spyOn(service[HTTP], POST).and.callThrough();

    service.exportEmail(fakeCanvas, GraphicFormat.SVG, FAKE_EMAIL, FAKE_STR);

    expect(spyURL).toHaveBeenCalled();
    expect(spyGet).toHaveBeenCalled();
  });

  it('updatePreviewCanvas should call svgToCanvas from GraphicsManager', () => {
    spyOn(SvgManager, GET_ASPECT_RATIO).and.returnValue(FAKE_DIMENSIONS);
    spyOn(service.graphicalManager, SVG_TO_CANVAS);

    service.updatePreviewCanvas(FAKE_SVG, FAKE_CANVAS);

    expect(SvgManager.getAspectRatio).toHaveBeenCalled();
    expect(service.graphicalManager.svgToCanvas).toHaveBeenCalled();
  });

  it('updateExportCanvas should call svgToCanvas from GraphicsManager', () => {
    spyOn(service.graphicalManager, SVG_TO_CANVAS);

    service.updateExportCanvas(FAKE_SVG, FAKE_CANVAS);

    expect(service.graphicalManager.svgToCanvas).toHaveBeenCalled();
  });

  it('validateEmail should return true on valid email', () => {
    const returnValue = service.validateEmail(FAKE_EMAIL);
    expect(returnValue).toBeTruthy();
  });

  it('validateEmail should return false on invalid email', () => {
    const returnValue = service.validateEmail(FAKE_INVALID_EMAIL);
    expect(returnValue).toBeFalsy();
  });
});
