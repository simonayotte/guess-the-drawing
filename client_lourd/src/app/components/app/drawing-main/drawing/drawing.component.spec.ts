import { ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule} from '@angular/material';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogDismissService } from 'src/app/services/Dialog/dialog-dismiss.service';
import { DrawingComponent } from './drawing.component';

const LEFT_BUTTON = 0;
const RIGHT_BUTTON = 1;
const RENDERER = 'renderer';
const CURRENT_DRAWING_SERVICE = 'currentDrawingService';
const DRAWING_SIZE_SERVICE = 'drawingSizeService';
const NUMBER_CHILD_NOT_TO_DELETE = 5;
const NUMBER_CHILD_NOT_TO_DELETE_OVER = 6;
const DISMISSERVICE  = 'dismissService';
const eraserService = 'eraserService';
const gallerieDrawing = 'gallerieDrawing';
const ADD_PATH = 'addPath';
const CALLED_FOUR_TIMES = 4;
const PIPETTE = 'pipette';

describe('a drawing component', () => {
  let component: DrawingComponent;
  let fixture: ComponentFixture<DrawingComponent>;
  const path: SVGPathElement = {} as SVGPathElement;
  let dialogDismissService: DialogDismissService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, AppRoutingModule, AppModule, MatProgressSpinnerModule],
      providers: [Renderer2, {provide: ElementRef, useClass: class MockElementRef extends ElementRef { constructor() { super(null); } }}]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogDismissService = TestBed.get(DialogDismissService);
    dialogDismissService.dismissDecision(true);
  });

  afterEach( () => {
    dialogDismissService.dismissDecision(true);
  });

  // constructor
  it('constructor call clearDrawing if dismissService.dismissChanges value is true', () => {
    spyOn(component, 'clearDrawing').and.callFake(() => { return; });
    component[DISMISSERVICE].dismissChanges.next(true);
    expect(component.clearDrawing).toHaveBeenCalled();
  });
  it('append path to root element should set current path if we pass set rectangle at the same time', () => {
    component[RENDERER].appendChild = jasmine.createSpy().and.callFake(() => {return; });
    component[CURRENT_DRAWING_SERVICE].addPathToDrawing = jasmine.createSpy().and.callFake(() => {return; });
    component.appendPathToRootElement(path, true);
    expect(component.currentPath).toBe(path);
  });
  it('constructor not call clearDrawing if dismissService.dismissChanges value is false', () => {
    spyOn(component, 'clearDrawing').and.callFake(() => { return; });
    component[DISMISSERVICE].dismissChanges.next(false);
    expect(component.clearDrawing).not.toHaveBeenCalled();
  });

  // ngOnInit
  it('should call add path to element ing svgStringBS subscribe', () => {
    // tslint:disable-next-line: max-line-length --> Disable if not, it would take to many lines
    const SVG_STRING = '<svg xmlns="http://www.w3.org/2000/svg" _ngcontent-rve-c16="" height="200" stroke-width="0px" style="background-color:rgba(255, 255, 255, 1)" width="1000"><filter _ngcontent-rve-c16="" color-interpolation-filters="linearRGB" filterUnits="userSpaceOnUse" height="140%" id="texture1" primitiveUnits="userSpaceOnUse" width="140%" x="-20%" y="-20%"><feGaussianBlur _ngcontent-rve-c16="" edgeMode="none" height="100%" in="SourceGraphic" result="blur1" stdDeviation="5 5" width="100%" x="0%" y="0%"/></filter><filter _ngcontent-rve-c16="" color-interpolation-filters="linearRGB" filterUnits="userSpaceOnUse" height="140%" id="texture2" primitiveUnits="userSpaceOnUse" width="140%" x="-20%" y="-20%"><feTurbulence _ngcontent-rve-c16="" baseFrequency="0.05" height="100%" numOctaves="2" result="turbulence" seed="1" stitchTiles="stitch" type="turbulence" width="100%" x="0%" y="0%"/><feDisplacementMap _ngcontent-rve-c16="" height="100%" in="SourceGraphic" in2="turbulence" result="displacementMap" scale="50" width="100%" x="0%" xChannelSelector="R" y="0%" yChannelSelector="B"/></filter><filter _ngcontent-rve-c16="" color-interpolation-filters="linearRGB" filterUnits="userSpaceOnUse" height="140%" id="texture3" primitiveUnits="userSpaceOnUse" width="140%" x="-20%" y="-20%"><feTurbulence _ngcontent-rve-c16="" baseFrequency="0.5" height="100%" numOctaves="2" result="turbulence" seed="1" stitchTiles="stitch" type="fractalNoise" width="100%" x="0%" y="0%"/><feDisplacementMap _ngcontent-rve-c16="" height="100%" in="SourceGraphic" in2="turbulence" result="displacementMap" scale="50" width="100%" x="0%" xChannelSelector="R" y="0%" yChannelSelector="B"/></filter><filter _ngcontent-rve-c16="" color-interpolation-filters="linearRGB" filterUnits="userSpaceOnUse" height="140%" id="texture4" primitiveUnits="userSpaceOnUse" width="140%" x="-20%" y="-20%"><feTurbulence _ngcontent-rve-c16="" baseFrequency="0.5" height="100%" numOctaves="2" result="turbulence" seed="1" stitchTiles="stitch" type="turbulence" width="100%" x="0%" y="0%"/><feDisplacementMap _ngcontent-rve-c16="" height="100%" in="SourceGraphic" in2="turbulence" result="displacementMap" scale="10" width="100%" x="0%" xChannelSelector="R" y="0%" yChannelSelector="B"/></filter><filter _ngcontent-rve-c16="" color-interpolation-filters="linearRGB" filterUnits="userSpaceOnUse" height="140%" id="texture5" primitiveUnits="userSpaceOnUse" width="140%" x="-20%" y="-20%"><feTurbulence _ngcontent-rve-c16="" baseFrequency="0 0.25" height="100%" numOctaves="2" result="turbulence" seed="1" stitchTiles="stitch" type="turbulence" width="100%" x="0%" y="0%"/><feDisplacementMap _ngcontent-rve-c16="" height="100%" in="SourceGraphic" in2="turbulence" result="displacementMap" scale="50" width="100%" x="0%" xChannelSelector="R" y="0%" yChannelSelector="B"/></filter><path _ngcontent-rve-c15="" stroke-width="25" stroke="rgba(46, 49, 49, 1)" fill="none" stroke-linecap="round" stroke-linejoin="round" d="M 145 77 L 145 77 L 147 77 L 149 77 L 181 89 L 205 97 L 245 107 L 269 111 L 313 115 L 325 116 L 339 116 L 341 116 L 341 116 L 341 116 "/></svg>';

    spyOn(component, 'addPathToElement');
    component[gallerieDrawing].svgStringBS.next(SVG_STRING);

    expect(component.addPathToElement).toHaveBeenCalled();
  });

  // initializeSvgAttribute
  it('initializeSvgAttribute should call setAttribute 4 times', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component[RENDERER], 'setAttribute');
    component.initializeSvgAttribute();
    expect(component[RENDERER].setAttribute).toHaveBeenCalledTimes(CALLED_FOUR_TIMES);
  });

  // handleError()
  it('handleError should print in console an error if error is thrown ', () => {
    const mockError = new Error('error');
    spyOn(console, 'error');
    component.handleError(mockError);
    expect(console.error).toHaveBeenCalled();
  });

  // onDrag
  it('onDrag should call prevent default on the event', () => {
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'preventDefault').and.returnValue();

    component.onDrag(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  // onMouseClick
  it('onMouseClick should call onMouseClick function', () => {
    const mockEvent = new MouseEvent('click');
    spyOn(component.tool, 'onMouseClick').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseClick(mockEvent);
    expect(component.tool.onMouseClick).toHaveBeenCalled();
    expect(appendPathSpy).toHaveBeenCalled();

    appendPathSpy.and.throwError('error');
    spyOn(component, 'handleError');

    try {
      component.onMouseClick(mockEvent);
    } catch (error) {
      expect(component.handleError).toHaveBeenCalled();
    }
  });

  // onMouseDownInElement
  it('onMouseDownInElement should call onMouseDownInElement function', () => {
    const mockEvent = new MouseEvent('mousedown', { buttons : LEFT_BUTTON });
    spyOn(component.tool, 'onMouseDownInElement').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseDownInElement(mockEvent);
    expect(component.tool.onMouseDownInElement).toHaveBeenCalled();
    expect(appendPathSpy).toHaveBeenCalled();

    appendPathSpy.and.throwError('error');
    spyOn(component, 'handleError');

    try {
      component.onMouseDownInElement(mockEvent);
    } catch (error) {
      expect(component.handleError).toHaveBeenCalled();
    }
  });

  it('onMouseDownInElement should call not onMouseDown function', () => {
    const  mockClick: MouseEvent = new MouseEvent('click', { button : RIGHT_BUTTON });
    spyOn(component.tool, 'onMouseDown').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseDownInElement(mockClick);

    expect(component.tool.onMouseDown).not.toHaveBeenCalled();
    expect(appendPathSpy).not.toHaveBeenCalled();
  });

  it('onMouseDownInElement should call appendPathToRootElement if the returned element of onRightMouseDownInElement is not null', () => {
    const  mockClick: MouseEvent = new MouseEvent('click', { button : RIGHT_BUTTON });
    spyOn(component.tool, 'onRightMouseDownInElement').and.returnValue(path);
    spyOn(component, 'appendPathToRootElement');
    component.onMouseDownInElement(mockClick);
    expect(component.appendPathToRootElement).toHaveBeenCalled();
  });

  it('onMouseDownInElement should call no function when onMouseDownInElement return null', () => {
    const mockEvent = new MouseEvent('mousedown', { buttons : LEFT_BUTTON });
    spyOn(component.tool, 'onMouseDownInElement').and.returnValue(null);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseDownInElement(mockEvent);

    expect(appendPathSpy).toHaveBeenCalledTimes(0);
  });

  it('onMouseDownInElement should call no function when onRightMouseDownInElement return null', () => {
    const  mockClick: MouseEvent = new MouseEvent('click', { button : RIGHT_BUTTON });
    spyOn(component.tool, 'onRightMouseDownInElement').and.returnValue(null);
    spyOn(component, 'appendPathToRootElement');

    component.onMouseDownInElement(mockClick);

    expect(component.appendPathToRootElement).toHaveBeenCalledTimes(0);
  });

  // onMouseDown
  it('onMouseDown should call onMouseDown function', () => {
    const mockEvent = new MouseEvent('mousedown', { buttons : LEFT_BUTTON });
    spyOn(component.tool, 'onMouseDown').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseDown(mockEvent);
    expect(component.tool.onMouseDown).toHaveBeenCalled();
    expect(appendPathSpy).toHaveBeenCalled();

    appendPathSpy.and.throwError('error');
    spyOn(component, 'handleError');

    try {
      component.onMouseDown(mockEvent);
    } catch (error) {
      expect(component.handleError).toHaveBeenCalled();
    }
  });

  it('onMouseDown should call appendPathToRootElement if the returned element of onRightMouseClickDown is not null', () => {
    const  mockClick: MouseEvent = new MouseEvent('click', { button : RIGHT_BUTTON });
    spyOn(component.tool, 'onRightClickDown').and.returnValue(path);
    spyOn(component, 'appendPathToRootElement');
    component.onMouseDown(mockClick);
    expect(component.appendPathToRootElement).toHaveBeenCalled();
  });

  it('onMouseDown should call not onMouseDown function', () => {
    const  mockClick: MouseEvent = new MouseEvent('click', { button : RIGHT_BUTTON });
    spyOn(component.tool, 'onMouseDown').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseDown(mockClick);

    expect(component.tool.onMouseDown).not.toHaveBeenCalled();
    expect(appendPathSpy).not.toHaveBeenCalled();
  });

  it('onMouseDown should call no function when onMouseDown return null', () => {
    const mockEvent = new MouseEvent('mousedown', { buttons : LEFT_BUTTON });
    spyOn(component.tool, 'onMouseDown').and.returnValue(null);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseDown(mockEvent);

    expect(appendPathSpy).toHaveBeenCalledTimes(0);
  });

  it('onMouseDown should call no function when onRightClickDown return null', () => {
    const  mockClick: MouseEvent = new MouseEvent('click', { button : RIGHT_BUTTON });
    spyOn(component.tool, 'onRightClickDown').and.returnValue(null);
    spyOn(component, 'appendPathToRootElement');

    component.onMouseDown(mockClick);

    expect(component.appendPathToRootElement).toHaveBeenCalledTimes(0);
  });

  // onMouseUp
  it('onMouseUp should call onMouseUp function', () => {
    const mockEvent = new MouseEvent('mouseup');
    spyOn(component.tool, 'onMouseUp').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseUp(mockEvent);
    expect(component.tool.onMouseUp).toHaveBeenCalled();
    expect(appendPathSpy).toHaveBeenCalled();

    appendPathSpy.and.throwError('error');
    spyOn(component, 'handleError');

    try {
      component.onMouseUp(mockEvent);
    } catch (error) {
      expect(component.handleError).toHaveBeenCalled();
    }
  });

  // onDoubleClick
  it('onDoubleClick should call onDoubleClick function', () => {
    const mockEvent = new MouseEvent('dblclick');
    spyOn(component.tool, 'onDoubleClick').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onDoubleClick(mockEvent);
    expect(component.tool.onDoubleClick).toHaveBeenCalled();
    expect(appendPathSpy).toHaveBeenCalled();

    appendPathSpy.and.throwError('error');
    spyOn(component, 'handleError');

    try {
      component.onDoubleClick(mockEvent);
    } catch (error) {
      expect(component.handleError).toHaveBeenCalled();
    }
  });

  // onMouseLeave
  it('onMouseLeave should call onMouseLeave function', () => {
    const mockEvent = new MouseEvent('mouseleave');
    spyOn(component.tool, 'onMouseLeave').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseLeave(mockEvent);
    expect(component.tool.onMouseLeave).toHaveBeenCalled();
    expect(appendPathSpy).toHaveBeenCalled();

    appendPathSpy.and.throwError('error');
    spyOn(component, 'handleError');

    try {
      component.onMouseLeave(mockEvent);
    } catch (error) {
      expect(component.handleError).toHaveBeenCalled();
    }
  });

  // onMouseEnter
  it('onMouseEnter should call onMouseEnter function', () => {
    const mockEvent = new MouseEvent('mouseenter');
    spyOn(component.tool, 'onMouseEnter').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseEnter(mockEvent);
    expect(component.tool.onMouseEnter).toHaveBeenCalled();
    expect(appendPathSpy).toHaveBeenCalled();

    appendPathSpy.and.throwError('error');
    spyOn(component, 'handleError');

    try {
      component.onMouseEnter(mockEvent);
    } catch (error) {
      expect(component.handleError).toHaveBeenCalled();
    }
  });

  // onMouseMove
  it('onMouseMove should call onMouseMove function', () => {
    const mockEvent = new MouseEvent('mousemove');
    spyOn(component.tool, 'onMouseMove').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onMouseMove(mockEvent);
    expect(component.tool.onMouseMove).toHaveBeenCalled();
    expect(appendPathSpy).toHaveBeenCalled();

    appendPathSpy.and.throwError('error');
    spyOn(component, 'handleError');

    try {
      component.onMouseMove(mockEvent);
    } catch (error) {
      expect(component.handleError).toHaveBeenCalled();
    }
  });
  // onShiftUp
  it('onShiftDown should call onShiftDown function', () => {
    const mockEvent = new KeyboardEvent('shiftuDown');
    spyOn(component.tool, 'onShiftDown').and.throwError('error');
    spyOn(component, 'handleError');
    component.onShiftDown(mockEvent);
    expect(component.handleError).toHaveBeenCalled();
  });

  it('onShiftDown should call appendPathToRootElement if the returned element of onShiftDown is not null', () => {
    const mockEvent = new KeyboardEvent('shiftdown');
    spyOn(component.tool, 'onShiftDown').and.returnValue(path);
    spyOn(component, 'appendPathToRootElement');
    component.onShiftDown(mockEvent);
    expect(component.appendPathToRootElement).toHaveBeenCalled();
  });

  it('onShiftDown should not call appendPathToRootElement if the returned element of onShiftDown is null', () => {
    const mockEvent = new KeyboardEvent('shiftdown');
    spyOn(component.tool, 'onShiftDown').and.returnValue(null);
    spyOn(component, 'appendPathToRootElement');
    component.onShiftDown(mockEvent);
    expect(component.appendPathToRootElement).toHaveBeenCalledTimes(0);
  });

  // onShiftUp
  it('onShiftUp should call onShiftUp function', () => {
    const mockEvent = new KeyboardEvent('shiftUp');
    spyOn(component.tool, 'onShiftUp').and.throwError('error');
    spyOn(component, 'handleError');
    component.onShiftUp(mockEvent);
    expect(component.handleError).toHaveBeenCalled();
  });

  it('onShiftUp should call appendPathToRootElement if the returned element of onShiftUp is not null', () => {
    const mockEvent = new KeyboardEvent('shiftUp');
    spyOn(component.tool, 'onShiftUp').and.returnValue(path);
    spyOn(component, 'appendPathToRootElement');
    component.onShiftUp(mockEvent);
    expect(component.appendPathToRootElement).toHaveBeenCalled();
  });

  it('onShiftUp should not call appendPathToRootElement if the returned element of onShiftDown is null', () => {
    const mockEvent = new KeyboardEvent('shiftUp');
    spyOn(component.tool, 'onShiftUp').and.returnValue(null);
    spyOn(component, 'appendPathToRootElement');
    component.onShiftUp(mockEvent);
    expect(component.appendPathToRootElement).toHaveBeenCalledTimes(0);
  });

  // onBackspaceDown
  it('onBackspaceDown should call onBackspaceDown function', () => {
    const mockEvent = new KeyboardEvent('backspace');
    spyOn(component.tool, 'onBackspaceDown').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onBackspaceDown(mockEvent);
    expect(component.tool.onBackspaceDown).toHaveBeenCalled();
    expect(appendPathSpy).toHaveBeenCalled();

    appendPathSpy.and.throwError('error');
    spyOn(component, 'handleError');

    try {
      component.onBackspaceDown(mockEvent);
    } catch (error) {
      expect(component.handleError).toHaveBeenCalled();
    }
  });

  // onEscapeClick
  it('onEscapeClick should call onBackSpaceDown function ', () => {
    const mockEvent = new KeyboardEvent('escapeclick');
    spyOn(component.tool, 'onEscapeClick').and.returnValue(path);
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');

    component.onEscapeClick(mockEvent);
    expect(component.tool.onEscapeClick).toHaveBeenCalled();
    expect(appendPathSpy).toHaveBeenCalled();

    appendPathSpy.and.throwError('error');
    spyOn(component, 'handleError');

    try {
      component.onEscapeClick(mockEvent);
    } catch (error) {
      expect(component.handleError).toHaveBeenCalled();
    }
  });

  // onResize()
  it('onResize should call updateWidth and updateHeight if getUserWantsMaxSize is true', () => {
    spyOn(component[DRAWING_SIZE_SERVICE], 'updateWidth');
    spyOn(component[DRAWING_SIZE_SERVICE], 'updateHeight');
    const userWantsMaxSizeSpy = spyOn(component[DRAWING_SIZE_SERVICE], 'getUserWantsMaxSize').and.returnValue(false);

    component.onResize();
    expect(component[DRAWING_SIZE_SERVICE].getUserWantsMaxSize).toHaveBeenCalled();
    expect(component[DRAWING_SIZE_SERVICE].updateWidth).toHaveBeenCalledTimes(0);
    expect(component[DRAWING_SIZE_SERVICE].updateHeight).toHaveBeenCalledTimes(0);
    userWantsMaxSizeSpy.and.returnValue(true);

    component.onResize();
    expect(component[DRAWING_SIZE_SERVICE].getUserWantsMaxSize).toHaveBeenCalled();
    expect(component[DRAWING_SIZE_SERVICE].updateWidth).toHaveBeenCalledTimes(1);
    expect(component[DRAWING_SIZE_SERVICE].updateHeight).toHaveBeenCalledTimes(1);

  });

  // appendPathToRootElement()
  it('appendPathToRootElement should call appendChild and addPathToDrawing if path is defined ', () => {
    spyOn(component[RENDERER], 'appendChild').and.returnValue();
    spyOn(component[CURRENT_DRAWING_SERVICE], 'addPathToDrawing').and.returnValue();

    component.appendPathToRootElement(path);
    expect(component[RENDERER].appendChild).toHaveBeenCalled();
    expect(component[CURRENT_DRAWING_SERVICE].addPathToDrawing).toHaveBeenCalled();
  });

  it('appendPathToRootElement should not call appendChild and not call addPathToDrawing if path is defined ', () => {
    const pathElement = undefined as unknown as SVGPathElement;
    spyOn(component[RENDERER], 'appendChild').and.returnValue();
    spyOn(component[CURRENT_DRAWING_SERVICE], 'addPathToDrawing').and.returnValue();

    component.appendPathToRootElement(pathElement);
    expect(component[RENDERER].appendChild).toHaveBeenCalledTimes(0);
    expect(component[CURRENT_DRAWING_SERVICE].addPathToDrawing).toHaveBeenCalledTimes(0);
  });

  // onPopState
  it('onPopState should call clearDrawing ', () => {
    spyOn(component, 'clearDrawing').and.returnValue();

    component.onPopState();
    expect(component.clearDrawing).toHaveBeenCalled();

  });

  // clearDrawing()
  it('clearDrawing should delete native elements until 5', () => {
    const clearStackSpy = spyOn(component[CURRENT_DRAWING_SERVICE], 'clearStack');
    const spy = spyOnProperty(component.svg.nativeElement, 'childElementCount');
    spy.and.returnValue(NUMBER_CHILD_NOT_TO_DELETE_OVER);
    spyOn(component.svg.nativeElement, 'removeChild').and.callFake(() => {
      spy.and.returnValue(NUMBER_CHILD_NOT_TO_DELETE);
    });

    component.clearDrawing();
    expect(spy).toHaveBeenCalled();
    expect(clearStackSpy).toHaveBeenCalled();
  });

  it('should call append child when whe call addPathToElement', () => {
    const pathElement: SVGPathElement = {} as SVGPathElement;
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component[eraserService], ADD_PATH);
    const spyAppend = spyOn(component[RENDERER], 'appendChild');
    component.addPathToElement(pathElement);
    expect(spyAppend).toHaveBeenCalled();
  });

  it('removePathOfElement should call removeChild of svg', () => {
    const pathElement: SVGPathElement = {} as SVGPathElement;
    const spyOnRemoveChild = spyOn(component.svg.nativeElement, 'removeChild');
    component.removePathOfElement(pathElement);
    expect(spyOnRemoveChild).toHaveBeenCalled();
  });

  it('removePathOfElement should not call removeChild of svg', () => {
    const pathElement: SVGPathElement = false as unknown as SVGPathElement;
    const spyOnRemoveChild = spyOn(component.svg.nativeElement, 'removeChild');
    component.removePathOfElement(pathElement);
    expect(spyOnRemoveChild).toHaveBeenCalledTimes(0);
  });

  it('onControlA should call preventDefault, stopPropagation', () => {
    const mockEvent = new KeyboardEvent('control.shift.A');
    spyOn(mockEvent, 'stopPropagation');
    spyOn(mockEvent, 'preventDefault');
    component.tool.name = PIPETTE;
    component.onControlA(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('onKeyDown should call onArrowsChange if a arrowss key is pressed', () => {
    spyOn(component.arrowKeysDown, 'has').and.returnValue(true);
    spyOn(component.arrowKeysDown, 'set');
    spyOn(component.tool, 'onArrowsChange');
    component.onKeyDown(new KeyboardEvent('leftArrow'));
    expect(component.arrowKeysDown.set).toHaveBeenCalled();
    expect(component.tool.onArrowsChange).toHaveBeenCalled();
  });

  it('onKeyDown should not call onArrowsChange if the pressed key is not an arrow', () => {
    spyOn(component.arrowKeysDown, 'has').and.returnValue(false);
    spyOn(component.arrowKeysDown, 'set');
    spyOn(component.tool, 'onArrowsChange');
    component.onKeyDown(new KeyboardEvent('control'));
    expect(component.arrowKeysDown.set).toHaveBeenCalledTimes(0);
    expect(component.tool.onArrowsChange).toHaveBeenCalledTimes(0);
  });

  it('onKeyUp should call onArrowsChange if a arrowss key is pressed', () => {
    spyOn(component.arrowKeysDown, 'has').and.returnValue(true);
    spyOn(component.arrowKeysDown, 'set');
    spyOn(component.tool, 'onArrowsChange');
    component.onKeyUp(new KeyboardEvent('leftArrow'));
    expect(component.arrowKeysDown.set).toHaveBeenCalled();
    expect(component.tool.onArrowsChange).toHaveBeenCalled();
  });

  it('onKeyUp should not call onArrowsChange if the pressed key is not an arrow', () => {
    spyOn(component.arrowKeysDown, 'has').and.returnValue(false);
    spyOn(component.arrowKeysDown, 'set');
    spyOn(component.tool, 'onArrowsChange');
    component.onKeyUp(new KeyboardEvent('control'));
    expect(component.arrowKeysDown.set).toHaveBeenCalledTimes(0);
    expect(component.tool.onArrowsChange).toHaveBeenCalledTimes(0);
  });

  it('onMouseWheel should call onMouseWheel', () => {
    const mockEvent = new WheelEvent('wheelEvent');
    spyOn(component.tool, 'onMouseWheel');

    component.onMouseWheel(mockEvent);
    expect(component.tool.onMouseWheel).toHaveBeenCalled();
  });

  it('onMouseWheel should call handle error if the tool doesnt use the mouse wheel', () => {
    const appendPathSpy = spyOn(component, 'appendPathToRootElement');
    appendPathSpy.and.throwError('error');
    const mockEvent = new WheelEvent('wheelEvent');
    spyOn(component, 'handleError');
    component.onMouseWheel(mockEvent);
    expect(component.handleError).toHaveBeenCalled();
  });
  it('addPathToElement should call the eraserservice to update the translate if there is one', () => {
    component[eraserService].refreshTransform = jasmine.createSpy().and.callFake(() => {return; });
    component[eraserService].addPath = jasmine.createSpy().and.callFake(() => {return; });
    component[RENDERER].appendChild = jasmine.createSpy().and.callFake(() => {return; });
    component.addPathToElement(path, [1, 1]);
    expect( component[eraserService].refreshTransform).toHaveBeenCalled();
  });
// We Disabled this rule since this is a test file and the number of lines is not important
// tslint:disable-next-line: max-file-line-count
});
