import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerService } from 'src/app/services/color-picker/color-picker.service';
import { FailedToGet2DContextError } from '../../../../../errors/failed-to-get-two-d-context';
import { ColorPaletteComponent } from './color-palette.component';

const mousedown = 'mousedown';
const colorPickerService = 'colorPickerService';

const CTX = 'ctx';
const CONTEXT_ERROR = 'Failed to get 2D context';
const SUBSCRIBE = 'subscribe';
const COLOR_PICKER_SERVICE = 'colorPickerService';
const BEGIN_PATH = 'beginPath';

describe('ColorPaletteComponent', () => {
  let component: ColorPaletteComponent;
  let fixture: ComponentFixture<ColorPaletteComponent>;
  const mockMouseEvent = new MouseEvent('mouseEvent');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPaletteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component[colorPickerService] = new ColorPickerService();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should subscribe to hueClick', () => {
    const spySubscribe = spyOn(component[COLOR_PICKER_SERVICE].hueClick, SUBSCRIBE);

    component.ngOnInit();

    expect(spySubscribe).toHaveBeenCalled();
  });

  // draw()
  it('draw should throw an error', () => {
    component[CTX] = undefined as unknown as CanvasRenderingContext2D;
    spyOn(component.palette.nativeElement, 'getContext').and.returnValue(null);

    try {
      component.draw();
      expect(1).toBe(0);
    } catch (error) {
      expect(1).toBe(1);
      expect(error).toEqual(new FailedToGet2DContextError (CONTEXT_ERROR));
    }
  });

  it('drawSelectionCircle should do nothing if selectedPosition is not set', () => {
    const spy = spyOn(component[CTX], BEGIN_PATH);

    component.selectedPosition = null as unknown as { x: number; y: number; };
    component.drawSelectionCircle();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  // correctSelectedPosition
  it('correctSelectedPosition should set postion to minSelectedPosition', () => {
    const minSelectedPos = 1;
    const shouldSetMinValue = {x: 0 , y: 0};

    component.correctSelectedPosition(shouldSetMinValue);

    expect(shouldSetMinValue.x).toEqual(minSelectedPos);
    expect(shouldSetMinValue.y).toEqual(minSelectedPos);
  });

  it('correctSelectedPosition should set postion to minSelectedPosition', () => {
    const maxSelectedPos = 249;
    const shouldSetMinValue = {x: 450 , y: 450};

    component.correctSelectedPosition(shouldSetMinValue);

    expect(shouldSetMinValue.x).toEqual(maxSelectedPos);
    expect(shouldSetMinValue.y).toEqual(maxSelectedPos);
  });

  // update()
  it('update() should call draw and density.next ', () => {
    spyOn(component, 'draw');
    spyOn(component[colorPickerService].density, 'next');

    component.update();

    expect(component.draw).toHaveBeenCalledTimes(1);
    expect(component[colorPickerService].density.next).toHaveBeenCalledTimes(1);
  });

  // onMouseUp(evt: MouseEvent)
  it('onMouseUp should set mousedown to false', () => {
    component[mousedown] = true;

    component.onMouseUp(mockMouseEvent);

    expect(component[mousedown]).toBe(false);
  });

  // onMouseDown(evt: MouseEvent)
  it('onMouseDown should set mousedown selectedPosition and call draw and next', () => {
    component[mousedown] = false;

    spyOn(component, 'draw');
    spyOn(component[colorPickerService].density, 'next');
    spyOn(component, 'correctSelectedPosition');

    component.onMouseDown(mockMouseEvent);

    expect(component[mousedown]).toBe(true);
    expect(component.draw).toHaveBeenCalledTimes(1);
    expect(component[colorPickerService].density.next).toHaveBeenCalledTimes(1);
    expect(component.correctSelectedPosition).toHaveBeenCalled();
  });

  // onMouseMove(evt: MouseEvent)
  it('onMouseMove should set selectedPosition and call draw and getPixelFromImage if mouseDown = true', () => {
    component[mousedown] = true;

    spyOn(component, 'draw');
    spyOn(component[colorPickerService].density, 'next');
    spyOn(component, 'correctSelectedPosition');

    component.onMouseMove(mockMouseEvent);

    expect(component.draw).toHaveBeenCalledTimes(1);
    expect(component[colorPickerService].density.next).toHaveBeenCalledTimes(1);
    expect(component.correctSelectedPosition).toHaveBeenCalled();
  });

  it('onMouseMove should not set selectedPosition and call draw and getPixelFromImage if mouseDown = false', () => {
    component[mousedown] = false;

    spyOn(component, 'draw');
    spyOn(component[colorPickerService].density, 'next');
    spyOn(component, 'correctSelectedPosition');

    component.onMouseMove(mockMouseEvent);

    expect(component.draw).toHaveBeenCalledTimes(0);
    expect(component[colorPickerService].density.next).toHaveBeenCalledTimes(0);
    expect(component.correctSelectedPosition).toHaveBeenCalledTimes(0);
  });

  // correctSelectedPosition
  it('correctSelectedPosition should set postion to minSelectedPosition', () => {
    const minSelectedPos = 1;
    const shouldSetMinValue = {x: 0 , y: 0};

    component.correctSelectedPosition(shouldSetMinValue);

    expect(shouldSetMinValue.x).toEqual(minSelectedPos);
    expect(shouldSetMinValue.y).toEqual(minSelectedPos);
  });

  it('correctSelectedPosition should set postion to minSelectedPosition', () => {
    const maxSelectedPos = 249;
    const shouldSetMinValue = {x: 450 , y: 450};

    component.correctSelectedPosition(shouldSetMinValue);

    expect(shouldSetMinValue.x).toEqual(maxSelectedPos);
    expect(shouldSetMinValue.y).toEqual(maxSelectedPos);
  });
});
