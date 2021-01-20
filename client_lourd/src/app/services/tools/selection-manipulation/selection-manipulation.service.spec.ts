import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { SelectionManipulationService } from './selection-manipulation.service';

const RENDERER = 'renderer';
const BIGGEST_VALUE = 'biggestValue';
const SMALLEST_VALUE = 'smallestValue';
const SELECTION_BOX_CALLBACK = 'selectionBoxCallBack';
const SCROLLING_OFFSET = 'scrollingOffset';
const DELETE_LAST_ROTATE = 'deleteLastRotate';
const TOOLBAR_OFFSET = 120;
const X = 0;
const Y = 1;

class MockRenderer2 {
  appendChild(): void {
    return;
  }
  setAttribute(): void {
    return;
  }
  createElement(): void {
    return;
  }
}
describe('SelectionManipulationService', () => {
  let service: SelectionManipulationService;

  beforeEach(async(() => TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]})));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SelectionManipulationService]});
    service = TestBed.get(SelectionManipulationService);
    service[RENDERER] = TestBed.get(Renderer2);
    service.initializeRenderer(service[RENDERER]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initializeRenderer should set the value of the renderer', () => {
    const mockRenderer = service[RENDERER];
    service.initializeRenderer(mockRenderer);
    expect(service[RENDERER]).toBe(mockRenderer);
  });

  it('getCenterPositionOfElement should call getBoundingClientRect to find the center', () => {
    const mockPath = jasmine.createSpyObj('mockPath', ['getBoundingClientRect']);
    const mockBbox = jasmine.createSpyObj('mockBBOX', ['left', 'right', 'top', 'bottom']);
    mockBbox.left = 0;
    mockBbox.top = 0;
    mockBbox.right = 0;
    mockBbox.bottom = 0;
    mockPath.getBoundingClientRect.and.returnValue(mockBbox);
    service.getCenterPositionOfElement(mockPath);
    expect(mockPath.getBoundingClientRect).toHaveBeenCalled();
  });

  it('getCenterPositionOfElement should return the middle of the bounding box minus the toolbar offset and scroll offset', () => {
    const mockPath = jasmine.createSpyObj('mockPath', ['getBoundingClientRect']);
    const mockBbox = jasmine.createSpyObj('mockBBOX', ['left', 'right', 'top', 'bottom']);
    mockBbox.left = 0;
    mockBbox.top = 0;
    mockBbox.right = 0;
    mockBbox.bottom = 0;
    service[SCROLLING_OFFSET] = [TOOLBAR_OFFSET, TOOLBAR_OFFSET];
    mockPath.getBoundingClientRect.and.returnValue(mockBbox);
    expect(service.getCenterPositionOfElement(mockPath)).toEqual([( mockBbox.left +  mockBbox.right) / 2  - TOOLBAR_OFFSET +
                                   service[SCROLLING_OFFSET][X], (mockBbox.top + mockBbox.bottom) / 2  + service[SCROLLING_OFFSET][Y]]);
  });

  it('biggestValue should return the biggest value between the two passed as parameters', () => {
    const smallestValue = 0;
    const biggestValue = 1;
    expect(service[BIGGEST_VALUE](smallestValue, biggestValue)).toEqual(biggestValue);
  });

  it('biggestValue should return the first value if the second one is smaller', () => {
    const smallestValue = 0;
    const biggestValue = 1;
    expect(service[BIGGEST_VALUE](biggestValue, smallestValue)).toEqual(biggestValue);
  });

  it('smallestValue should return the smallest value between the two passed as parameters', () => {
    const smallestValue = 0;
    const biggestValue = 1;
    expect(service[SMALLEST_VALUE](smallestValue, biggestValue)).toEqual(smallestValue);
  });

  it('initializeSelectionBoxCallback should set the selection box callback', () => {
    const mockCallback = jasmine.createSpyObj('callback', ['test']);
    service.initalizeSelectionBoxCallBack(mockCallback);
    expect(service[SELECTION_BOX_CALLBACK]).toEqual(mockCallback);
  });

  it('getCenterPositionOfAllElements should return the center of all the selectedElements', () => {
    const mockPath = jasmine.createSpyObj('mockPath', ['getBoundingClientRect']);
    const mockBbox = jasmine.createSpyObj('mockBBOX', ['left', 'right', 'top', 'bottom']);
    mockBbox.left = 0;
    mockBbox.top = 0;
    mockBbox.right = 0;
    mockBbox.bottom = 0;
    service[SCROLLING_OFFSET] = [TOOLBAR_OFFSET, TOOLBAR_OFFSET];
    mockPath.getBoundingClientRect.and.returnValue(mockBbox);
    expect(service.getCenterPositionOfAllElements([mockPath, mockPath])).toEqual([( mockBbox.left +  mockBbox.right) / 2  - TOOLBAR_OFFSET +
                                   service[SCROLLING_OFFSET][X], (mockBbox.top + mockBbox.bottom) / 2  + service[SCROLLING_OFFSET][Y]]);
  });

  it('updateRotation should call getAttribute and setAttribute', () => {
    const selectedPath = jasmine.createSpyObj('path', ['getAttribute']);
    selectedPath.getAttribute.and.returnValue('transform');
    spyOn(service, 'getCenterPositionOfElement').and.returnValue([0, 0]);
    spyOn(service[RENDERER], 'setAttribute');
    service[SELECTION_BOX_CALLBACK] = (() => {return; });
    service.updateRotation(selectedPath);
    expect(selectedPath.getAttribute).toHaveBeenCalled();
    expect(service[RENDERER].setAttribute).toHaveBeenCalled();
  });

  it('updateRotation should delete the last rotate if the transform string exist', () => {
    const selectedPath = jasmine.createSpyObj('path', ['getAttribute']);
    selectedPath.getAttribute.and.returnValue('transform');
    spyOn(service, 'getCenterPositionOfElement').and.returnValue([0, 0]);
    // We disabled this rule so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'deleteLastRotate');
    service[SELECTION_BOX_CALLBACK] = (() => {return; });
    service.updateRotation(selectedPath);
    expect(service[DELETE_LAST_ROTATE]).toHaveBeenCalled();
  });

  it('updateRotation should set the transform attribute even if there is no rotation angle', () => {
    const selectedPath = jasmine.createSpyObj('path', ['getAttribute']);
    selectedPath.getAttribute.and.returnValues(null, null);
    spyOn(service, 'getCenterPositionOfElement').and.returnValue([0, 0]);
    spyOn(service[RENDERER], 'setAttribute');
    // We disabled this rule so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'deleteLastRotate');
    service[SELECTION_BOX_CALLBACK] = (() => {return; });
    service.updateRotation(selectedPath);
    expect(service[RENDERER].setAttribute).toHaveBeenCalled();
  });

  it('deleteLastRotate should call substring if the passed string contains the word rotate', () => {
    const testString = 'rotate( 0, 0, 0) ';
    expect(service[DELETE_LAST_ROTATE](testString)).toEqual('');
  });

  it('deleteLastRotate should not call substring if the passed string does not contains the word rotate', () => {
    const testString = 'translate( 0, 0, 0) ';
    expect(service[DELETE_LAST_ROTATE](testString)).toEqual('translate( 0, 0, 0) ');
  });

  it('addOffSetToPostion should add the scrolling offset and toolbar offset to the position passed in parameter', () => {
    const offsetX = 120;
    const offsetY = 10;
    service[SCROLLING_OFFSET][X] = offsetX;
    service[SCROLLING_OFFSET][Y] = offsetY;

    expect(service.addOffsetToPosition(0, 0)).toEqual([0 - TOOLBAR_OFFSET + offsetX, 0 + offsetY]);
  });
});
