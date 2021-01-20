import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture,  TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../../material/material.module';
import { ExporterService } from '../../../services/exporter-service/exporter.service';
import { Filter, GraphicFormat } from '../tools/graphics/graphics-types';
import { SvgManager } from '../tools/graphics/svg-manager';
import { ExporterComponent } from './exporter.component';

const SUBSCRIBE = 'subscribe';
const SVG_SERVICE = 'svgService';
const SET_FILTER = 'setFilter';
const EXPORTER_SERVICE = 'exporterService';
const EXPORT_LOCALLY = 'exportLocally';
const CLICK = 'click';
const EXPORT_EMAIL = 'exportEmail';
const LOCAL = 'local';
const EMAIL = 'email';
const RESIZE = 'resize';
const GET_DIMENSIONS = 'getDimensions';
const QUERY_SELECTOR = 'querySelector';
const REMOVE_CHILD = 'removeChild';
const APPEND_CHILD = 'appendChild';
const SET_STYLE = 'setStyle';
const GET_ATTRIBUTE = 'getAttribute';
const REMOVE_ATTRIBUTE = 'removeAttribute';
const UPDATE_PREVIEW_CANVAS = 'updatePreviewCanvas';
const UPDATE_EXPORT_CANVAS = 'updateExportCanvas';
const CLONE_METHOD = 'clone';
const VALID_EMAIL = 'aaa@aaa.com';
const VALIDATE_EMAIL = 'validateEmail';
const UPDATE_ALERT = 'updateAlert';

const FAKE_STR = 'str';

const FAKE_SVG = {
  // fake element
  querySelector: () => {
    // fake function
  },
  removeAttribute: () => {
    // fake function
  }
} as unknown as SVGElement;

const FAKE_SVG_G_ELEMENT = {
  childNodes: [1, 2],
  firstChild: {
    getAttribute: () => {
      // fake function
    }
  },
  removeChild: () => {
    // fake function
  },
  appendChild: () => {
    // fake function
  }
} as unknown as SVGGElement;

describe('ExporterComponent', () => {
  let component: ExporterComponent;
  let fixture: ComponentFixture<ExporterComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      providers: [ExporterService],
      declarations: [ExporterComponent],
      imports: [MaterialModule, FormsModule, HttpClientModule, BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ExporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should subscribe to svgSubject from svgService', () => {
    const spyClone = spyOn(SvgManager, CLONE_METHOD);
    const spySubscribe = spyOn(component[SVG_SERVICE].svgSubject, SUBSCRIBE);
    const spyFilter = spyOn(component, SET_FILTER);

    component.ngOnInit();

    expect(spyClone).toHaveBeenCalled();
    expect(spySubscribe).toHaveBeenCalled();
    expect(spyFilter).toHaveBeenCalled();
  });

  it('exportSvg should call exportLocally from exporterService with svgElement if svg output is selected', () => {
    const spyExport = spyOn(component[EXPORTER_SERVICE], EXPORT_LOCALLY);
    const spyClick = spyOn(component.download.nativeElement, CLICK);

    component.selectedDestination = LOCAL;
    component.selectedFormat = GraphicFormat.SVG;
    component.exportSvg();

    expect(spyExport).toHaveBeenCalled();
    expect(spyClick).toHaveBeenCalled();
  });

  it('exportSvg should call exportLocally from exporterService with exportCanvas if svg output is not selected', () => {
    const spyExport = spyOn(component[EXPORTER_SERVICE], EXPORT_LOCALLY);
    const spyClick = spyOn(component.download.nativeElement, CLICK);

    component.selectedDestination = LOCAL;
    component.exportSvg();

    expect(spyExport).toHaveBeenCalled();
    expect(spyClick).toHaveBeenCalled();
  });

  it('exportSvg should call exportEmail from exporterService', () => {
    component.selectedDestination = EMAIL;
    component.email = VALID_EMAIL;
    const spyExport = spyOn(component[EXPORTER_SERVICE], EXPORT_EMAIL);

    component.exportSvg();

    expect(spyExport).toHaveBeenCalled();
  });

  it('exportSvg should call validateEmail if email is invalid', () => {
    component.selectedDestination = EMAIL;
    const spyExport = spyOn(component[EXPORTER_SERVICE], EXPORT_EMAIL);
    const spyValidate = spyOn(component, VALIDATE_EMAIL);

    component.exportSvg();

    expect(spyExport).toHaveBeenCalledTimes(0);
    expect(spyValidate).toHaveBeenCalled();
  });

  it('replaceGSvg should clear the gExport element and call appendChild with the new element', () => {
    const spyQuery = spyOn(component.exportSvgElement, QUERY_SELECTOR).and.returnValue(FAKE_SVG_G_ELEMENT);
    const spyResize = spyOn(SvgManager, RESIZE);
    const spyDimensions = spyOn(SvgManager, GET_DIMENSIONS);
    const spyRemove = spyOn(FAKE_SVG_G_ELEMENT, REMOVE_CHILD);
    const spyAppend = spyOn(FAKE_SVG_G_ELEMENT, APPEND_CHILD);
    const spyClone = spyOn(SvgManager, CLONE_METHOD);
    const spyAttribute = spyOn(FAKE_SVG_G_ELEMENT.firstChild as SVGGElement, GET_ATTRIBUTE).and.returnValue(FAKE_STR);
    const spyStyle = spyOn(SvgManager, SET_STYLE);

    component.replaceGSvg();

    expect(spyQuery).toHaveBeenCalled();
    expect(spyResize).toHaveBeenCalled();
    expect(spyDimensions).toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalled();
    expect(spyAppend).toHaveBeenCalled();
    expect(spyClone).toHaveBeenCalled();
    expect(spyAttribute).toHaveBeenCalled();
    expect(spyStyle).toHaveBeenCalled();
  });

  it('replaceGSvg should do nothing if gElement wasnt found', () => {
    const spyQuery = spyOn(component.exportSvgElement, QUERY_SELECTOR);
    const spyResize = spyOn(SvgManager, RESIZE);
    const spyDimensions = spyOn(SvgManager, GET_DIMENSIONS);
    const spyRemove = spyOn(FAKE_SVG_G_ELEMENT, REMOVE_CHILD);
    const spyAppend = spyOn(FAKE_SVG_G_ELEMENT, APPEND_CHILD);
    const spyClone = spyOn(SvgManager, CLONE_METHOD);
    const spyAttribute = spyOn(FAKE_SVG_G_ELEMENT.firstChild as SVGGElement, GET_ATTRIBUTE);
    const spyStyle = spyOn(SvgManager, SET_STYLE);

    component.replaceGSvg();

    expect(spyQuery).toHaveBeenCalled();
    expect(spyResize).toHaveBeenCalledTimes(0);
    expect(spyDimensions).toHaveBeenCalledTimes(0);
    expect(spyRemove).toHaveBeenCalledTimes(0);
    expect(spyAppend).toHaveBeenCalledTimes(0);
    expect(spyClone).toHaveBeenCalledTimes(0);
    expect(spyAttribute).toHaveBeenCalledTimes(0);
    expect(spyStyle).toHaveBeenCalledTimes(0);
  });

  it('replaceGSvg shouldnt set the style if the style attribute wasnt found', () => {
    const spyQuery = spyOn(component.exportSvgElement, QUERY_SELECTOR).and.returnValue(FAKE_SVG_G_ELEMENT);
    const spyResize = spyOn(SvgManager, RESIZE);
    const spyDimensions = spyOn(SvgManager, GET_DIMENSIONS);
    const spyRemove = spyOn(FAKE_SVG_G_ELEMENT, REMOVE_CHILD);
    const spyAppend = spyOn(FAKE_SVG_G_ELEMENT, APPEND_CHILD);
    const spyClone = spyOn(SvgManager, CLONE_METHOD);
    const spyAttribute = spyOn(FAKE_SVG_G_ELEMENT.firstChild as SVGGElement, GET_ATTRIBUTE);
    const spyStyle = spyOn(SvgManager, SET_STYLE);

    component.replaceGSvg();

    expect(spyQuery).toHaveBeenCalled();
    expect(spyResize).toHaveBeenCalled();
    expect(spyDimensions).toHaveBeenCalled();
    expect(spyRemove).toHaveBeenCalled();
    expect(spyAppend).toHaveBeenCalled();
    expect(spyClone).toHaveBeenCalled();
    expect(spyAttribute).toHaveBeenCalled();
    expect(spyStyle).toHaveBeenCalledTimes(0);
  });

  it('applyFilterToSvg to call remoteAttribute if filter is none', () => {
    const spy = spyOn(FAKE_SVG, REMOVE_ATTRIBUTE);

    component.applyFilterToSvg(FAKE_SVG, Filter.NONE);

    expect(spy).toHaveBeenCalled();
  });

  it('applyFilterToSvg should call setFilter if filter is not none', () => {
    const spy = spyOn(SvgManager, SET_FILTER);

    component.applyFilterToSvg(FAKE_SVG, Filter.INVERTED);

    expect(spy).toHaveBeenCalled();
  });

  it('setFilter should call applyFilterToSvg and update the preview and export canvas', () => {
    const spyQuery = spyOn(component.exportSvgElement, QUERY_SELECTOR).and.returnValue(FAKE_SVG);
    const spyPreview = spyOn(component[EXPORTER_SERVICE], UPDATE_PREVIEW_CANVAS);
    const spyExport = spyOn(component[EXPORTER_SERVICE], UPDATE_EXPORT_CANVAS);

    component.setFilter();

    expect(spyQuery).toHaveBeenCalled();
    expect(spyPreview).toHaveBeenCalled();
    expect(spyExport).toHaveBeenCalled();
  });

  it('setFilter should do nothing if gElement wasnt found', () => {
    const spyQuery = spyOn(component.exportSvgElement, QUERY_SELECTOR);
    const spyPreview = spyOn(component[EXPORTER_SERVICE], UPDATE_PREVIEW_CANVAS);
    const spyExport = spyOn(component[EXPORTER_SERVICE], UPDATE_EXPORT_CANVAS);

    component.setFilter();

    expect(spyQuery).toHaveBeenCalled();
    expect(spyPreview).toHaveBeenCalledTimes(0);
    expect(spyExport).toHaveBeenCalledTimes(0);
  });

  it('validateEmail should call updateAlert and validateEmail from exporterService', () => {
    const spyAlert = spyOn(component, UPDATE_ALERT);
    const spyValidate = spyOn(component[EXPORTER_SERVICE], VALIDATE_EMAIL);

    component.validateEmail();

    expect(spyAlert).toHaveBeenCalled();
    expect(spyValidate).toHaveBeenCalled();
  });

  it ('updateAlert should set alert to message and error to parameter value if display is true', () => {
    component.updateAlert(FAKE_STR, true, true);

    expect(component.alert).toBe(FAKE_STR);
    expect(component.displayAlertErr).toBeTruthy();
    expect(component.displayAlertSucc).toBeFalsy();
  });

  it ('updateAlert should set alert to message and error to !parameter value if display is false', () => {
    component.updateAlert(FAKE_STR, false, true);

    expect(component.alert).toBe(FAKE_STR);
    expect(component.displayAlertErr).toBeFalsy();
    expect(component.displayAlertSucc).toBeFalsy();
  });

  it ('updateAlert should set alert to message and error to !parameter value if display is true', () => {
    component.updateAlert(FAKE_STR, true, false);

    expect(component.alert).toBe(FAKE_STR);
    expect(component.displayAlertErr).toBeFalsy();
    expect(component.displayAlertSucc).toBeTruthy();
  });
});
