import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SvgManager } from 'src/app/components/app/tools/graphics/svg-manager';
import { MetaDataDB } from '../../../models/meta-data-bd';
import { SvgStringManipulationService } from '../svgStringManipulation/svg-string-manipulation.service';
import { GallerieService } from './gallerie.service';

const fromB64Str = 'getStringFromB64';
const gallerieDrawingService = 'gallerieDrawingService';
const setValuesWithSvgString = 'setValuesWithSvgString';
const drawingSizeService = 'drawingSizeService';
const updateHeight = 'updateHeight';
const updateWidth = 'updateWidth';
const getHeight = 'getHeight';
const getWidth = 'getWidth';
const getBackGroundColor = 'getBackGroundColor';
const router = 'router';
const navigateByUrl = 'navigateByUrl';
const selectedColors =  'selectedColors';
const next = 'next';
const metaDataDB = 'metaDataDB';
const graphicsManager = 'graphicsManager';
const svg64BtoCanvas = 'svg64BtoCanvas';
const httpCient = 'httpCient';
const get = 'get';
const getAllDrawingHTTP = 'getAllDrawingHTTP';
const exporterService = 'exporterService';
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';

const CANVAS = 'canvas';
const ID = 'id';
const ID_1 = '1';

describe('GallerieService', () => {
  let service: GallerieService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule]
  }));

  beforeEach(() => {
    service = TestBed.get(GallerieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // getMetaData
  it('setDrawings should set metaDataDB', () => {
    const mockMetaDataBD: MetaDataDB[] = [{_id: '1', name: '1', tags: ['1'], imageData: '1'},
                                          {_id: '2', name: '2', tags: ['2'], imageData: '2'},
                                          {_id: '3', name: '3', tags: ['3'], imageData: '3'}];

    service[metaDataDB] = mockMetaDataBD;

    const returnValue = service.getMetaData();

    expect(returnValue).toEqual(mockMetaDataBD);
  });

  // setDrawings
  it('setDrawings should set metaDataDB', () => {
    const mockMetaDataBD: MetaDataDB[] = [{_id: '1', name: '1', tags: ['1'], imageData: '1'},
                                          {_id: '2', name: '2', tags: ['2'], imageData: '2'},
                                          {_id: '3', name: '3', tags: ['3'], imageData: '3'}];

    service.setDrawings(mockMetaDataBD);

    expect(service[metaDataDB]).toEqual(mockMetaDataBD);
  });

  // isDrawings
  it('isDrawings should return true', () => {
    const mockMetaDataBD: MetaDataDB[] = [{_id: '1', name: '1', tags: ['1'], imageData: '1'},
                                          {_id: '2', name: '2', tags: ['2'], imageData: '2'},
                                          {_id: '3', name: '3', tags: ['3'], imageData: '3'}];

    const returnValue = service.isDrawings(mockMetaDataBD);

    expect(returnValue).toBe(true);
  });

  it('isDrawings should return true', () => {
    const mockMetaDataBD: MetaDataDB[] = [];

    const returnValue = service.isDrawings(mockMetaDataBD);

    expect(returnValue).toBe(false);
  });

  // deleteDrawing
  it('deleteDrawing should call functions and delete from local variable selected drawing', () => {
    const mockMetaDataBD: MetaDataDB[] = [{_id: '1', name: '1', tags: ['1'], imageData: '1'},
                                          {_id: '2', name: '2', tags: ['2'], imageData: '2'},
                                          {_id: '3', name: '3', tags: ['3'], imageData: '3'}];
    const mockTags: string[] = ['1'];
    const expectedReturnMetaDataBD: MetaDataDB[] = [{_id: '2', name: '2', tags: ['2'], imageData: '2'},
                                                    {_id: '3', name: '3', tags: ['3'], imageData: '3'}];
    service[metaDataDB] = mockMetaDataBD;

    service.deleteDrawing(ID_1, mockTags);

    expect(service[metaDataDB]).toEqual(expectedReturnMetaDataBD);
  });

  // getAllDrawingHTTP
  it('getAllDrawingHTTP should call function', () => {
    spyOn(service[httpCient], get);

    service[getAllDrawingHTTP]();

    expect(service[httpCient].get).toHaveBeenCalledTimes(1);
  });

  // loadPreviewImages
  it('loadPreviewImages should call it s fonction', () => {
    const mockDocument = new Document();
    const canvas1 = mockDocument.createElement(CANVAS);
    canvas1.setAttribute(ID, '1');
    mockDocument.appendChild(canvas1);
    const mockMetaDataBD: MetaDataDB[] = [{_id: '1', name: '1', tags: ['1'], imageData: '1'}];
    service[metaDataDB] = mockMetaDataBD;

    spyOn(service[exporterService], 'updatePreviewCanvas');
    spyOn(service[graphicsManager], 'svgToCanvas');

    service.loadPreviewImages(mockDocument);

    expect(service[graphicsManager].svgToCanvas).toHaveBeenCalledTimes(1);
    expect(service[exporterService].updatePreviewCanvas).toHaveBeenCalledTimes(1);
  });

  it('loadPreviewImages should throw error', () => {
    const mockDocument = new Document();
    const mockMetaDataBD: MetaDataDB[] = [{_id: '1', name: '1', tags: ['1'], imageData: '1'}];
    service[metaDataDB] = mockMetaDataBD;

    spyOn(service[graphicsManager], svg64BtoCanvas);

    try {
      service.loadPreviewImages(mockDocument);
    } catch (error) {
      expect(1).toEqual(1);
    }

    expect(service[graphicsManager].svg64BtoCanvas).toHaveBeenCalledTimes(0);
  });

  // tagSearch
  it('tagSearch should return the full list of metaDataDB', () => {
    const mockMetaDataBD: MetaDataDB[] = [{_id: '', name: '', tags: [''], imageData: ''}];
    const mockTags: string[] = [];

    service[metaDataDB] = mockMetaDataBD;

    const returnMetaDataDB = service.tagSearch(mockTags);

    expect(returnMetaDataDB).toEqual(mockMetaDataBD);
  });

  it('tagSearch should return list of metaDataDb conatain at least one tag', () => {
    const mockMetaDataBD: MetaDataDB[] = [{_id: '1', name: '1', tags: ['1'], imageData: '1'},
                                          {_id: '2', name: '2', tags: ['2'], imageData: '2'},
                                          {_id: '3', name: '3', tags: ['3'], imageData: '3'}];
    const mockTags: string[] = ['1'];
    const expectedReturnMetaDataBD: MetaDataDB[] = [{_id: '1', name: '1', tags: ['1'], imageData: '1'}];

    service[metaDataDB] = mockMetaDataBD;

    const returnMetaDataDB = service.tagSearch(mockTags);

    expect(returnMetaDataDB).toEqual(expectedReturnMetaDataBD);
  });

  // openDrawing
  it('openDrawing should call all it s fonction', () => {
    const mockMetaDataBD: MetaDataDB = {_id: '', name: '', tags: [''], imageData: ''};

    spyOn(SvgManager, fromB64Str);
    spyOn(service[gallerieDrawingService], setValuesWithSvgString);
    spyOn(service[drawingSizeService], updateHeight);
    spyOn(service[drawingSizeService], updateWidth);
    spyOn(SvgStringManipulationService, getHeight);
    spyOn(SvgStringManipulationService, getWidth);
    spyOn(SvgStringManipulationService, getBackGroundColor);
    spyOn(service[selectedColors].backgroundColorBS, next);
    spyOn(service[router], navigateByUrl);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');

    service.openDrawing(mockMetaDataBD);

    expect(SvgManager.getStringFromB64).toHaveBeenCalled();
    expect(service[gallerieDrawingService].setValuesWithSvgString).toHaveBeenCalled();
    expect(service[drawingSizeService].updateHeight).toHaveBeenCalled();
    expect(service[drawingSizeService].updateWidth).toHaveBeenCalled();
    expect(SvgStringManipulationService.getHeight).toHaveBeenCalled();
    expect(SvgStringManipulationService.getWidth).toHaveBeenCalled();
    expect(service[selectedColors].backgroundColorBS.next).toHaveBeenCalled();
    expect(SvgStringManipulationService.getBackGroundColor).toHaveBeenCalled();
    expect(service[router].navigateByUrl).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

});
