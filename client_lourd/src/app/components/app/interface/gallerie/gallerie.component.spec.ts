import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MetaDataDB } from 'src/app/models/meta-data-bd';
import { MaterialModule} from '../../../../material/material.module';
import { GallerieComponent } from './gallerie.component';

const gallerieService = 'gallerieService';
const deleteDrawing = 'deleteDrawing';
const metaDataDB = 'metaDataDB';
const openDrawing = 'openDrawing';
const closeAll = 'closeAll';
const cdref = 'cdref';
const tempMetaDataDB = 'tempMetaDataDB';

const SAVE_DRAWING_SERVICE = 'saveDrawingService';
const ERROR_BACKGROUND = 'rgb(255, 110, 110)';
const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';
const TAG = 'tag';
const TAGS = 'tags';
const TAG_IS_VALID = 'tagIsValid';
const A_ID = '1';

describe('GallerieComponent', () => {
  let component: GallerieComponent;
  let fixture: ComponentFixture<GallerieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GallerieComponent ],
      imports: [HttpClientTestingModule, MaterialModule, BrowserAnimationsModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GallerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ngOnInit
  it('ngOnInit should call all of it s fonction', () => {
    const mockMetaDataBD: MetaDataDB[] = [{_id: '2', name: '2', tags: ['2'], imageData: '2'},
                                                    {_id: '3', name: '3', tags: ['3'], imageData: '3'}];

    spyOn(component[gallerieService], 'setDrawings');
    spyOn(component[gallerieService], 'getMetaData');
    spyOn(component[cdref], 'detectChanges');
    spyOn(component[gallerieService], 'loadPreviewImages');
    spyOn(component[gallerieService], 'getAllDrawingHTTP').and.returnValue(of(mockMetaDataBD));

    component.ngOnInit();

    expect(component[gallerieService].setDrawings).toHaveBeenCalledTimes(1);
    expect(component[gallerieService].getMetaData).toHaveBeenCalledTimes(1);
    expect(component[cdref].detectChanges).toHaveBeenCalledTimes(1);
    expect(component[gallerieService].loadPreviewImages).toHaveBeenCalledTimes(1);
  });

  // search
  it('search should call it s fonction', () => {
    spyOn(component[cdref], 'detectChanges');
    spyOn(component[gallerieService], 'loadPreviewImages');

    component.search();

    expect(component[cdref].detectChanges).toHaveBeenCalled();
    expect(component[gallerieService].loadPreviewImages).toHaveBeenCalled();
  });

  it('search should set metaDataDB', () => {
    const mockMetaDataBD: MetaDataDB[] = [{_id: '1', name: '1', tags: ['1'], imageData: '1'}];
    const expectedReturnMetaDataBD: MetaDataDB[] = [{_id: '2', name: '2', tags: ['2'], imageData: '2'},
                                                    {_id: '3', name: '3', tags: ['3'], imageData: '3'}];

    component[metaDataDB] = mockMetaDataBD;
    component[tempMetaDataDB] = expectedReturnMetaDataBD;

    spyOn(component[cdref], 'detectChanges');
    spyOn(component[gallerieService], 'loadPreviewImages');

    component.search();

    expect(component[metaDataDB]).toEqual(expectedReturnMetaDataBD);
  });

  // openDrawing
  it('openDrawing should call all of its function', () => {
    const mockMetaDataBD: MetaDataDB = {_id: '1', name: '1', tags: ['1'], imageData: '1'};

    spyOn(component[gallerieService], openDrawing);
    spyOn(component.dialog, closeAll);

    component.openDrawing(mockMetaDataBD);

    expect(component[gallerieService].openDrawing).toHaveBeenCalledTimes(1);
    expect(component.dialog.closeAll).toHaveBeenCalledTimes(1);
  });

  // deleteDrawing
  it('deleteDrawing should set metaDateDB to return value from function', () => {
    const mockMetaDataBD: MetaDataDB[] = [{_id: '1', name: '1', tags: ['1'], imageData: '1'},
                                          {_id: '2', name: '2', tags: ['2'], imageData: '2'},
                                          {_id: '3', name: '3', tags: ['3'], imageData: '3'}];
    const expectedReturnMetaDataBD: MetaDataDB[] = [{_id: '2', name: '2', tags: ['2'], imageData: '2'},
                                                    {_id: '3', name: '3', tags: ['3'], imageData: '3'}];
    component[metaDataDB] = mockMetaDataBD;

    spyOn(component[gallerieService], deleteDrawing).and.returnValue(expectedReturnMetaDataBD);

    component.deleteDrawing(A_ID);

    expect(component[metaDataDB]).toBe(expectedReturnMetaDataBD);
  });

  // onInputChangeTag()
  it('onInputChangeTag should call tagIsValid, stopImediatePropagation, ERROR_BACKGROUND is set  if tagIsValid false', () => {
    const mockEvent = new KeyboardEvent('mockEvent');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'tagIsValid').and.returnValue(false);
    component[TAGS] = [TAG, TAG, TAG, TAG, TAG, TAG];

    spyOn(component.tagInput.nativeElement.style, 'backgroundColor');

    component.onInputChangeTag( 'bad-tag', mockEvent);
    expect(component.tagInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
    expect(component[TAG]).toBe('');
    expect(component.btnAdd.disabled).toBe(true);
  });

  // onInputChangeTag()
  it('onInputChangeTag should call tagIsValid, stopImediatePropagation, DEFAULT_BACKGROUND is set  if tagIsValid', () => {
    const mockEvent = new KeyboardEvent('mockEvent');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'tagIsValid').and.returnValue(true);
    spyOn(mockEvent, 'stopImmediatePropagation');

    component.onInputChangeTag( 'goodTag', mockEvent);
    expect(component.tagInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component[TAG]).toBe('goodTag');
  });

  // btnAddTag()
  it('btnAddTag should toggle btn disabled to false if tagIsValid', () => {
    component[TAGS] = [TAG, TAG];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'tagIsValid').and.returnValue(true);
    const returnedValue = component.btnAddTag();
    expect(component.btnAdd.disabled).toBe(false);
    expect(returnedValue).toBe(false);
  });

  // resetValue()
  it('resetValue() should put the native value of tag at nothing', () => {
    component.tagInput.nativeElement.value = 'tag';
    component.resetValue();
    expect(component.tagInput.nativeElement.value).toBe('');
  });

  // removeTag()
  it('removeTag() should delete tag from tags', () => {
    component[TAGS] = [TAG];
    component.removeTag(TAG);
    expect(component[TAGS]).toEqual([]);
  });

  // addTag()
  it('addTag() should add tag in tags', () => {
    component[TAGS] = [];
    component[TAG] = TAG;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'tagIsValid').and.returnValue(true);
    component.addTag();
    expect(component[TAGS]).toEqual([TAG]);
  });

   // addTag()
  it('addTag() should not add tag in tags if tag not valid', () => {
    component[TAGS] = [];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'tagIsValid').and.returnValue(false);
    component.addTag();
    expect(component[TAGS]).toEqual([]);
  });

  // tagIsValid()
  it('tagIsValid() should call tagIsValid', () => {
    spyOn(component[SAVE_DRAWING_SERVICE], 'nameIsValid');
    component[TAG_IS_VALID](TAG);
    expect(component[SAVE_DRAWING_SERVICE].nameIsValid).toHaveBeenCalled();
  });
});
